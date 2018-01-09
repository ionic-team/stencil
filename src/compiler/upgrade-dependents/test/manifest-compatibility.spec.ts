import { BuildConfig, Manifest } from '../../../util/interfaces';
import { calculateRequiredUpgrades, CompilerUpgrade } from '../manifest-compatibility';
import { mockBuildConfig } from '../../../testing/mocks';


describe('Manifest Compatibility', () => {

  describe('calculateRequiredUpgrades', () => {

    it('should upgrade metadata', () => {
      const upgrades = calculateRequiredUpgrades(config, '0.1.0');
      expect(upgrades.indexOf(CompilerUpgrade.Metadata_Upgrade_From_0_1_0) > -1).toBe(true);
    });

    it('should upgrade jsx', () => {
      const upgrades = calculateRequiredUpgrades(config, '0.0.6-10');
      expect(upgrades.indexOf(CompilerUpgrade.JSX_Upgrade_From_0_0_5) > -1).toBe(true);
    });

    it('should have no upgrades', () => {
      const upgrades = calculateRequiredUpgrades(config, '99.99.99');
      expect(upgrades.length).toBe(0);
    });

  });

  var config = mockBuildConfig();

});
