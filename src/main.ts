import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import Clarity from '@microsoft/clarity';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

(window as any).PF = {
    config: {
        mode: 'bs4'
    }
};

Clarity.init(environment.clarityId);
platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
