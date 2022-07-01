import type * as d from '../../declarations';
import * as coreCompiler from '@stencil/core/compiler';
import { mockCompilerSystem, mockConfig, mockLogger as createMockLogger } from '@stencil/core/testing';
import * as ParseFlags from '../parse-flags';
import { run, runTask } from '../run';
import * as HelpTask from '../task-help';
import * as TelemetryTask from '../task-telemetry';
import { createTestingSystem } from '../../testing/testing-sys';

describe('run', () => {
  describe('run()', () => {
    let cliInitOptions: d.CliInitOptions;
    let mockLogger: d.Logger;
    let mockSystem: d.CompilerSystem;

    let parseFlagsSpy: jest.SpyInstance<
      ReturnType<typeof ParseFlags.parseFlags>,
      Parameters<typeof ParseFlags.parseFlags>
    >;

    beforeEach(() => {
      mockLogger = createMockLogger();
      mockSystem = createTestingSystem();

      cliInitOptions = {
        args: [],
        logger: mockLogger,
        sys: mockSystem,
      };

      parseFlagsSpy = jest.spyOn(ParseFlags, 'parseFlags');
      parseFlagsSpy.mockReturnValue({
        // use the 'help' task as a reasonable default for all calls to this function.
        // code paths that require a different task can always override this value as needed.
        task: 'help',
      });
    });

    afterEach(() => {
      parseFlagsSpy.mockRestore();
    });

    describe('help task', () => {
      let taskHelpSpy: jest.SpyInstance<ReturnType<typeof HelpTask.taskHelp>, Parameters<typeof HelpTask.taskHelp>>;

      beforeEach(() => {
        taskHelpSpy = jest.spyOn(HelpTask, 'taskHelp');
        taskHelpSpy.mockReturnValue(Promise.resolve());
      });

      afterEach(() => {
        taskHelpSpy.mockRestore();
      });

      it("calls the help task when the 'task' field is set to 'help'", () => {
        run(cliInitOptions);

        expect(taskHelpSpy).toHaveBeenCalledTimes(1);
        expect(taskHelpSpy).toHaveBeenCalledWith(
          {
            flags: {
              task: 'help',
              args: [],
            },
            outputTargets: [],
          },
          mockLogger,
          mockSystem
        );

        taskHelpSpy.mockRestore();
      });

      it("calls the help task when the 'help' field is set on flags", () => {
        parseFlagsSpy.mockReturnValue({
          help: true,
        });

        run(cliInitOptions);

        expect(taskHelpSpy).toHaveBeenCalledTimes(1);
        expect(taskHelpSpy).toHaveBeenCalledWith(
          {
            flags: {
              task: 'help',
              args: [],
            },
            outputTargets: [],
          },
          mockLogger,
          mockSystem
        );

        taskHelpSpy.mockRestore();
      });
    });
  });

  describe('runTask()', () => {
    let sys: d.CompilerSystem;
    let unvalidatedConfig: d.Config;

    let taskHelpSpy: jest.SpyInstance<ReturnType<typeof HelpTask.taskHelp>, Parameters<typeof HelpTask.taskHelp>>;
    let taskTelemetrySpy: jest.SpyInstance<
      ReturnType<typeof TelemetryTask.taskTelemetry>,
      Parameters<typeof TelemetryTask.taskTelemetry>
    >;

    beforeEach(() => {
      sys = mockCompilerSystem();
      sys.exit = jest.fn();

      unvalidatedConfig = mockConfig(sys);

      taskHelpSpy = jest.spyOn(HelpTask, 'taskHelp');
      taskHelpSpy.mockReturnValue(Promise.resolve());
      taskTelemetrySpy = jest.spyOn(TelemetryTask, 'taskTelemetry');
      taskTelemetrySpy.mockReturnValue(Promise.resolve());
    });

    afterEach(() => {
      taskHelpSpy.mockRestore();
      taskTelemetrySpy.mockRestore();
    });

    it('calls the help task', () => {
      runTask(coreCompiler, unvalidatedConfig, 'help', sys);

      expect(taskHelpSpy).toHaveBeenCalledTimes(1);
      expect(taskHelpSpy).toHaveBeenCalledWith(unvalidatedConfig, unvalidatedConfig.logger, sys);
    });

    describe('telemetry task', () => {
      it('calls the telemetry task when a compiler system is present', () => {
        runTask(coreCompiler, unvalidatedConfig, 'telemetry', sys);

        expect(taskTelemetrySpy).toHaveBeenCalledTimes(1);
        expect(taskTelemetrySpy).toHaveBeenCalledWith(unvalidatedConfig, sys, unvalidatedConfig.logger);
      });

      it("does not call the telemetry task when a compiler system isn't present", () => {
        runTask(coreCompiler, unvalidatedConfig, 'telemetry');

        expect(taskTelemetrySpy).not.toHaveBeenCalled();
      });
    });

    it('defaults to the help task for an unaccounted for task name', () => {
      // info is a valid task name, but isn't used in the `switch` statement of `runTask`
      runTask(coreCompiler, unvalidatedConfig, 'info', sys);

      expect(taskHelpSpy).toHaveBeenCalledTimes(1);
      expect(taskHelpSpy).toHaveBeenCalledWith(unvalidatedConfig, unvalidatedConfig.logger, sys);
    });
  });
});
