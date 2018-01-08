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
      ['/home/a.js',
        [ '/home/1' ]],
      ['/home/b.js',
        [ '/home/2', '/home/3' ]],
      ['/home/c.js',
        [ '/home/2', '/home/3', '/home/4' ]],
      ['/home/1.js',
        [ '/home/4' ]]
    ]);
    const graphedCommons = processGraph(modules, ['/home/a.js', '/home/b.js', '/home/c.js']);
    expect([...graphedCommons]).toEqual([
      {
        'entrypoint': true,
        'id': '/home/a.js',
        'srcs': ['/home/a.js', '/home/1']
      },
      {
        'entrypoint': true,
        'id': '/home/b.js',
        'srcs': ['/home/b.js']
      },
      {
        'entrypoint': false,
        'id': '/home/2',
        'srcs': ['/home/2']
      },
      {
        'entrypoint': false,
        'id': '/home/3',
        'srcs': ['/home/3']
      },
      {
        'entrypoint': true,
        'id': '/home/c.js',
        'srcs': ['/home/c.js']
      },
      {
        'entrypoint': false,
        'id': '/home/4',
        'srcs': ['/home/4']
      },
    ]);
  });
});
