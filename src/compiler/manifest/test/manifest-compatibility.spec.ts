import { BuildConfig, Manifest } from '../../../util/interfaces';
import { calculateRequiredUpgrades, parseCompilerVersion, CompilerUpgrade } from '../manifest-compatibility';


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

      it('not required for 0.0.6', () => {
        const v = parseCompilerVersion('0.0.6');
        const r = calculateRequiredUpgrades(v);
        expect(r.length).toBe(0);
      });

    });

  });


  describe('parseCompilerVersion', () => {

    it('parse 0.0.0', () => {
      const v = parseCompilerVersion('0.0.0');
      expect(v.major).toBe(0);
      expect(v.minor).toBe(0);
      expect(v.patch).toBe(0);
      expect(v.prerelease).toBe(0);
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
