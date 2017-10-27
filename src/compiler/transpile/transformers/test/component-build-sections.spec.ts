import { coreBuild } from '../../../../util/interfaces';
import { setBuildSectionFromMembers } from '../component-build-sections';
import * as ts from 'typescript';


describe('setBuildSectionFromMembers', () => {

  it('componentWillLoad', () => {
    setBuildSectionFromMembers(coreBuild, 'componentWillLoad');
    expect(coreBuild._build_will_load).toBe(true);
  });

  it('componentDidLoad', () => {
    setBuildSectionFromMembers(coreBuild, 'componentDidLoad');
    expect(coreBuild._build_did_load).toBe(true);
  });

  it('componentWillUpdate', () => {
    setBuildSectionFromMembers(coreBuild, 'componentWillUpdate');
    expect(coreBuild._build_will_update).toBe(true);
  });

  it('componentDidUpdate', () => {
    setBuildSectionFromMembers(coreBuild, 'componentDidUpdate');
    expect(coreBuild._build_did_update).toBe(true);
  });

  it('componentWillUnload', () => {
    setBuildSectionFromMembers(coreBuild, 'componentWillUnload');
    expect(coreBuild._build_will_unload).toBe(true);
  });

  it('componentDidUnload', () => {
    setBuildSectionFromMembers(coreBuild, 'componentDidUnload');
    expect(coreBuild._build_did_unload).toBe(true);
  });

  it('hostData', () => {
    setBuildSectionFromMembers(coreBuild, 'hostData');
    expect(coreBuild._build_host_render).toBe(true);
  });

  it('render', () => {
    setBuildSectionFromMembers(coreBuild, 'render');
    expect(coreBuild._build_render).toBe(true);
  });


  var coreBuild: coreBuild;

  beforeEach(() => {
    coreBuild = {};
  });

});
