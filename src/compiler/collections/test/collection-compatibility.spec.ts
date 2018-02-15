import { Collection, Config } from '../../../declarations';
import { CompilerUpgrade, calculateRequiredUpgrades } from '../collection-compatibility';
import { mockConfig } from '../../../testing/mocks';


describe('collection-compatibility', () => {

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

  const config = mockConfig();

});
