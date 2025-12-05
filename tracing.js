const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const { PeriodicExportingMetricReader, ConsoleMetricExporter } =
  require('@opentelemetry/sdk-metrics');
const { OTLPTraceExporter } =
  require('@opentelemetry/exporter-trace-otlp-http');

const { ExpressInstrumentation } =
  require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } =
  require('@opentelemetry/instrumentation-http');
const { MongoDBInstrumentation } =
  require('@opentelemetry/instrumentation-mongodb');

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'todo-service',
  }),
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new ExpressInstrumentation(),
    new MongoDBInstrumentation(),
    new HttpInstrumentation(),
  ],
});

sdk.start();
console.log('OpenTelemetry SDK started');

