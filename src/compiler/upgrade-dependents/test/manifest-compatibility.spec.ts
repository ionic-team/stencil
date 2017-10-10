import { BuildConfig, Manifest } from '../../../util/interfaces';
import { calculateRequiredUpgrades, parseCompilerVersion, CompilerUpgrade, semverLessThan } from '../manifest-compatibility';


describe('Manifest Compatibility', () => {

  describe('calculateRequiredUpgrades', () => {

    describe('JSX upgrade from custom h()', () => {

      it('required for 0.0.5', () => {
        const v = parseCompilerVersion('0.0.5');
        const r = calculateRequiredUpgrades(v);
        expect(r[0]).toBe(CompilerUpgrade.JSX_Upgrade_From_0_0_5);
        expect(r.length).toBe(1);
      });

      it('required for 0.0.5-99', () => {
        const v = parseCompilerVersion('0.0.5-99');
        const r = calculateRequiredUpgrades(v);
        expect(r[0]).toBe(CompilerUpgrade.JSX_Upgrade_From_0_0_5);
        expect(r.length).toBe(1);
      });

      it('required for 0.0.6-10', () => {
        const v = parseCompilerVersion('0.0.6-10');
        const r = calculateRequiredUpgrades(v);
        expect(r[0]).toBe(CompilerUpgrade.JSX_Upgrade_From_0_0_5);
        expect(r.length).toBe(1);
      });

      it('not required for 0.0.6-11', () => {
        const v = parseCompilerVersion('0.0.6-11');
        const r = calculateRequiredUpgrades(v);
        expect(r.length).toBe(0);
      });
      it('required for 0.0.6-0', () => {
        const v = parseCompilerVersion('0.0.6-0');
        const r = calculateRequiredUpgrades(v);
        expect(r.length).toBe(1);
      });

      it('not required for 0.0.6', () => {
        const v = parseCompilerVersion('0.0.6');
        const r = calculateRequiredUpgrades(v);
        expect(r.length).toBe(0);
      });
    });
  });


  describe('semverLessThan', () => {
    it('1.0.0 < 2.0.0', () => {
      expect(semverLessThan('1.0.0', '2.0.0')).toBe(true);
    });
    it('2.0.0 < 1.0.0 should be FALSE', () => {
      expect(semverLessThan('2.0.0', '1.0.0')).toBe(false);
    });
    it('0.1.0 < 0.2.0', () => {
      expect(semverLessThan('0.1.0', '0.2.0')).toBe(true);
    });
    it('0.2.0 < 0.1.0 should be FALSE', () => {
      expect(semverLessThan('0.2.0', '0.1.0')).toBe(false);
    });
    it('0.0.1 < 0.0.2', () => {
      expect(semverLessThan('0.0.1', '0.0.2')).toBe(true);
    });
    it('0.0.2 < 0.0.1 should be FALSE', () => {
      expect(semverLessThan('0.0.2', '0.0.1')).toBe(false);
    });
    it('1.1.0 < 1.2.0', () => {
      expect(semverLessThan('1.1.0', '1.2.0')).toBe(true);
    });
    it('1.1.0 < 1.1.1', () => {
      expect(semverLessThan('1.1.0', '1.1.1')).toBe(true);
    });
    it('1.1.1 < 1.1.1 should be FALSE', () => {
      expect(semverLessThan('1.1.1', '1.1.1')).toBe(false);
    });
    it('1.1.1-0 < 1.1.1', () => {
      expect(semverLessThan('1.1.1-0', '1.1.1')).toBe(true);
    });
    it('1.1.1-0 < 1.1.1-1', () => {
      expect(semverLessThan('1.1.1-0', '1.1.1-1')).toBe(true);
    });
    it('1.1.1-1 < 1.1.1-1 should be FALSE', () => {
      expect(semverLessThan('1.1.1-1', '1.1.1-1')).toBe(false);
    });
  });


  describe('parseCompilerVersion', () => {

    it('parse 0.0.0', () => {
      const v = parseCompilerVersion('0.0.0');
      expect(v.major).toBe(0);
      expect(v.minor).toBe(0);
      expect(v.patch).toBe(0);
      expect(v.prerelease).toBe(undefined);
    });

    it('parse 1.2.3-4', () => {
      const v = parseCompilerVersion('1.2.3-4');
      expect(v.major).toBe(1);
      expect(v.minor).toBe(2);
      expect(v.patch).toBe(3);
      expect(v.prerelease).toBe(4);
    });

    it('error for 1.2.3-alpha', () => {
      expect(() => {
        parseCompilerVersion('1.2.3-alpha');
      }).toThrow();
    });

  });

});
