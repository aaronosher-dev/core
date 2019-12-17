import { dirSync, setGracefulCleanup } from "tmp";

import { ConfigManager } from "@packages/core/src/common/config-manager";

let configManager: ConfigManager;

beforeEach(() => (configManager = new ConfigManager()));

afterAll(() => setGracefulCleanup());

describe("config", () => {
    it("should setup a new config with default values (latest channel)", () => {
        configManager.initialize({ configDir: dirSync().name, version: "3.0.0", bin: "ark" });

        expect(configManager.get("token")).toBe("ark");
        expect(configManager.get("channel")).toBe("latest");
    });

    it("should setup a new config with default values (next channel)", () => {
        configManager.initialize({ configDir: dirSync().name, version: "3.0.0-next.0", bin: "ark" });

        expect(configManager.get("token")).toBe("ark");
        expect(configManager.get("channel")).toBe("next");
    });

    it("should set and get a value", () => {
        configManager.initialize({ configDir: dirSync().name, version: "3.0.0", bin: "ark" });

        expect(configManager.get("token")).toBe("ark");

        configManager.set("token", "btc");

        expect(configManager.get("token")).toBe("btc");
    });

    it("should merge the given data", () => {
        configManager.initialize({ configDir: dirSync().name, version: "3.0.0", bin: "ark" });

        expect(configManager.get("token")).toBe("ark");
        expect(configManager.get("channel")).toBe("latest");

        configManager.update({ token: "btc", channel: "next" });

        expect(configManager.get("token")).toBe("btc");
        expect(configManager.get("channel")).toBe("next");
    });
});