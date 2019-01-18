import * as d from '@declarations';
import { BuildEvents } from '../../events';
import { FsWatchNormalizer } from '../fs-watch-normalizer';
import { mockConfig } from '../../../testing/mocks';


describe('FsWatchNormalizer', () => {

  const config = mockConfig();
  let w: FsWatchNormalizer;
  let events: BuildEvents;

  beforeEach(() => {
    events = new BuildEvents();
    w = new FsWatchNormalizer(config, events);
    w.queue = () => {/**/};
  });

  it('filesUpdated', async () => {
    const p1 = new Promise<d.FsWatchResults>(resolve => {
      events.subscribe('fsChange', resolve);
    });

    w.fileUpdate('cmp-a.css');
    w.fileUpdate('cmp-a.css');
    w.fileUpdate('cmp-a.tsx');
    w.fileUpdate('cmp-a.tsx');
    w.flush();

    const r1 = await p1;
    expect(r1.filesUpdated).toEqual(['cmp-a.css', 'cmp-a.tsx']);

    const p2 = new Promise<d.FsWatchResults>(resolve => {
      events.subscribe('fsChange', resolve);
    });

    w.fileUpdate('cmp-a.css');
    w.fileUpdate('cmp-a.css');
    w.fileUpdate('cmp-a.tsx');
    w.fileUpdate('cmp-a.tsx');
    w.flush();

    const r2 = await p2;
    expect(r2.filesUpdated).toEqual(['cmp-a.css', 'cmp-a.tsx']);
  });

  it('dirDelete', async () => {
    const p = new Promise<d.FsWatchResults>(resolve => {
      events.subscribe('fsChange', resolve);
    });

    w.dirDelete('delete-1');
    w.dirDelete('delete-1');
    w.dirDelete('delete-2');
    w.flush();

    const r = await p;
    expect(r.dirsDeleted).toEqual(['delete-1', 'delete-2']);
  });

  it('dirsAdded', async () => {
    const p = new Promise<d.FsWatchResults>(resolve => {
      events.subscribe('fsChange', resolve);
    });

    w.dirAdd('add-1');
    w.dirAdd('add-1');
    w.dirAdd('add-2');
    w.flush();

    const r = await p;
    expect(r.dirsAdded).toEqual(['add-1', 'add-2']);
  });

  it('filesAdded', async () => {
    const p = new Promise<d.FsWatchResults>(resolve => {
      events.subscribe('fsChange', resolve);
    });

    w.fileAdd('add-1');
    w.fileAdd('add-1');
    w.fileAdd('add-2');
    w.flush();

    const r = await p;
    expect(r.filesAdded).toEqual(['add-1', 'add-2']);
  });

  it('filesDeleted', async () => {
    const p = new Promise<d.FsWatchResults>(resolve => {
      events.subscribe('fsChange', resolve);
    });

    w.fileDelete('delete-1');
    w.fileDelete('delete-1');
    w.fileDelete('delete-2');
    w.flush();

    const r = await p;
    expect(r.filesDeleted).toEqual(['delete-1', 'delete-2']);
  });

});
