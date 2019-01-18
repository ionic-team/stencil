import * as d from '@declarations';
import { logger } from '@sys';


export function strickCheckDocs(docsData: d.JsonDocs) {
  docsData.components.forEach(component => {
    component.props.forEach(prop => {
      if (!prop.docs) {
        logger.warn(`Property "${prop.name}" of "${component.tag}" is not documented. ${component.filePath}`);
      }
    });
    component.methods.forEach(prop => {
      if (!prop.docs) {
        logger.warn(`Method "${prop.name}" of "${component.tag}" is not documented. ${component.filePath}`);
      }
    });
    component.events.forEach(prop => {
      if (!prop.docs) {
        logger.warn(`Event "${prop.event}" of "${component.tag}" is not documented. ${component.filePath}`);
      }
    });
  });
}
