import { app, Contracts } from "@arkecosystem/core-kernel";

export class EventListener {
    private readonly emitter: Contracts.Kernel.Events.IEventDispatcher = app.ioc.get<
        Contracts.Kernel.Events.IEventDispatcher
    >("events");

    public constructor(service: Contracts.P2P.IPeerService) {
        const connector: Contracts.P2P.IPeerConnector = service.getConnector();
        const storage: Contracts.P2P.IPeerStorage = service.getStorage();

        this.emitter.listen("internal.p2p.disconnectPeer", (name, { peer }) => {
            connector.disconnect(peer);
            storage.forgetPeer(peer);
        });

        const exitHandler = () => service.getMonitor().stopServer();

        process.on("SIGINT", exitHandler);
        process.on("exit", exitHandler);
    }
}
