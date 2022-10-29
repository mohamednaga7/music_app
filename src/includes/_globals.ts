import upperCase from 'lodash/upperCase';
import camelCase from 'lodash/camelCase';

export default {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  install(app: any) {
    const baseComponents = import.meta.glob('../components/base/*.vue', {
      eager: true,
    });

    Object.entries(baseComponents).forEach(([path, module]) => {
      const componentName = upperCase(
        camelCase(
          path
            .split('/')
            .pop()
            ?.replace(/\.\w+$/, '')
        )
      );
      console.log(componentName);
      app.component(`Base${componentName}`, (module as any).default);
    });
  },
};
