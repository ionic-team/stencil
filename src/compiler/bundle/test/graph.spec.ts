import { processGraph} from '../graph';

describe('chunk-plugin', () => {
  it('if a common module is included in 2 entry points them make it a new module', () => {
    const modules = new Map([
      ['a.js',
        [ '1.js' ]],
      ['b.js',
        [ '2.js' ]],
      ['c.js',
        [ '2.js', '4.js' ]]
    ]);
    const graphedCommons = processGraph(modules, ['a.js', 'b.js', 'c.js']);
    expect([...graphedCommons]).toEqual([
      {
        'id': 'a.js',
        'srcs': ['a.js', '1.js'],
        'entrypoint': true
      },
      {
        'id': 'b.js',
        'srcs': ['b.js'],
        'entrypoint': true
      },
      {
        'id': '2.js',
        'srcs': ['2.js'],
        'entrypoint': false
      },
      {
        'id': 'c.js',
        'srcs': ['c.js', '4.js'],
        'entrypoint': true
      }
    ]);
  });

  it('if common modules are included in 2 entry points them make them a new module', () => {
    const modules = new Map([
      ['a.js',
        [ '1.js' ]],
      ['b.js',
        [ '2.js', '3.js' ]],
      ['c.js',
        [ '2.js', '3.js', '4.js' ]]
    ]);
    const graphedCommons = processGraph(modules, ['a.js', 'b.js', 'c.js']);
    expect([...graphedCommons]).toEqual([
      {
        'id': 'a.js',
        'srcs': ['a.js', '1.js'],
        'entrypoint': true
      },
      {
        'id': 'b.js',
        'srcs': ['b.js'],
        'entrypoint': true
      },
      {
        'id': '2.js',
        'srcs': ['2.js'],
        'entrypoint': false
      },
      {
        'id': '3.js',
        'srcs': ['3.js'],
        'entrypoint': false
      },
      {
        'id': 'c.js',
        'srcs': ['c.js', '4.js'],
        'entrypoint': true
      }
    ]);
  });
  it('if a module that is not an entry point relies on a file then all associated should be seperated', () => {
    const modules = new Map([
      ['a.js',
        [ '1.js' ]],
      ['b.js',
        [ '2.js', '3.js' ]],
      ['c.js',
        [ '2.js', '3.js', '4.js' ]],
      ['1.js',
        [ '4.js' ]]
    ]);
    const graphedCommons = processGraph(modules, ['a.js', 'b.js', 'c.js']);
    expect([...graphedCommons]).toEqual([
      {
        'entrypoint': true,
        'id': 'a.js',
        'srcs': ['a.js', '1.js']
      },
      {
        'entrypoint': false,
        'id': '4.js',
        'srcs': ['4.js']
      },
      {
        'entrypoint': true,
        'id': 'b.js',
        'srcs': ['b.js']
      },
      {
        'entrypoint': false,
        'id': '2.js',
        'srcs': ['2.js']
      },
      {
        'entrypoint': false,
        'id': '3.js',
        'srcs': ['3.js']
      },
      {
        'entrypoint': true,
        'id': 'c.js',
        'srcs': ['c.js']
      }
    ]);
  });
});
