import { SpecReporter } from 'jasmine-spec-reporter';

console.log("Reporter loaded");

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
  spec: {
    displayStacktrace: 'pretty',
    displaySuccessful: true,
    displayFailed: true,
  }
}));
