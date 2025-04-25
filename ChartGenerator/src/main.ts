import { createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { createCustomElement } from '@angular/elements';
import { ChartCreatorFormComponent } from './chart-creator-form/chart-creator-form.component';
import { provideHttpClient } from '@angular/common/http';
import { ChartComponent } from './chart/chart.component';
import { ChartGeneratorComponent } from './chart-generator/chart-generator.component';

async function registerWebComponents() {
  try {
    const app = await createApplication({
      providers: [
        ...appConfig.providers,
        provideHttpClient()
      ]
    });

    const cartGeneratorComponent = createCustomElement(ChartGeneratorComponent, {
      injector: app.injector
    });

    if (!customElements.get('chart-g')) {
      customElements.define('chart-g', cartGeneratorComponent);
    }

    console.log('Web components registered successfully');
  } catch (err) {
    console.error('Failed to register web components:', err);
  }
}

registerWebComponents();
