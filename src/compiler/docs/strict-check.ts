import * as d from '../../declarations';


export function strickCheckDocs(config: d.Config, docsData: d.JsonDocs) {
  docsData.components.forEach(component => {
    component.props.forEach(prop => {
      if (!prop.docs) {
        config.logger.warn(`Property "${prop.name}" of "${component.tag}" is not documented. ${component.filePath}`);
      }
    });
    component.methods.forEach(prop => {
      if (!prop.docs) {
        config.logger.warn(`Method "${prop.name}" of "${component.tag}" is not documented. ${component.filePath}`);
      }
    });
    component.events.forEach(prop => {
      if (!prop.docs) {
        config.logger.warn(`Event "${prop.event}" of "${component.tag}" is not documented. ${component.filePath}`);
      }
    });
  });
}
