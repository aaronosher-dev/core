import { JsonObject } from "type-fest";
import { AbstractServiceProvider, ServiceProviderRepository } from "../../support";
import { PackageConfiguration } from "../../support/package-configuration";
import { PackageManifest } from "../../support/package-manifest";
import { IApplication } from "../../contracts/kernel";
import { IBootstrapper } from "../interfaces";
import { injectable, inject } from "../../ioc";

/**
 * @export
 * @class LoadServiceProviders
 * @implements {IBootstrapper}
 */
@injectable()
export class LoadServiceProviders implements IBootstrapper {
    /**
     * The application instance.
     *
     * @private
     * @type {IApplication}
     * @memberof Local
     */
    @inject("app")
    private readonly app: IApplication;

    /**
     * @returns {Promise<void>}
     * @memberof RegisterProviders
     */
    public async bootstrap(): Promise<void> {
        for (const [name, opts] of Object.entries(this.app.config<JsonObject>("packages"))) {
            const serviceProvider: AbstractServiceProvider = this.app.ioc.resolve(require(name).ServiceProvider);
            serviceProvider.setManifest(this.app.ioc.resolve(PackageManifest).discover(name));
            serviceProvider.setConfig(this.discoverConfiguration(serviceProvider, opts as JsonObject));

            this.app.ioc.get<ServiceProviderRepository>("serviceProviderRepository").set(name, serviceProvider);
        }
    }

    /**
     * Discover the configuration for the package of the given service provider.
     *
     * @private
     * @param {AbstractServiceProvider} serviceProvider
     * @param {JsonObject} opts
     * @returns {PackageConfiguration}
     * @memberof LoadServiceProviders
     */
    private discoverConfiguration(serviceProvider: AbstractServiceProvider, opts: JsonObject): PackageConfiguration {
        const hasDefaults: boolean = Object.keys(serviceProvider.configDefaults()).length > 0;

        if (hasDefaults) {
            return this.app.ioc
                .resolve(PackageConfiguration)
                .from(serviceProvider.name(), serviceProvider.configDefaults())
                .merge(opts);
        }

        return this.app.ioc
            .resolve(PackageConfiguration)
            .discover(serviceProvider.name())
            .merge(opts);
    }
}
