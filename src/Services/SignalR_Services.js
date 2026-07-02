// services/signalRService.js

import * as signalR from "@microsoft/signalr";

const signalRService = (() => {

    /**
     * Stores active connections by hub name.
     * Example:
     * {
     *   chat: HubConnection,
     *   notification: HubConnection
     * }
     */
    const connections = {};

    /**
     * Prevents multiple simultaneous start calls
     * for the same hub.
     */
    const connectionPromises = {};

    const showToast = (icon, title) => {
        // Integrate your toast library here if needed
        // Toast.fire({ icon, title });

        // console.log(`[${icon}] ${title}`);
    };

    /**
     * Start a hub connection.
     *
     * @param {string} hubName
     * @param {string} hubUrl
     * @param {string} userId
     * @param {string} token
     *
     * @returns {Promise<HubConnection>}
     */
    const start = async (
        hubName,
        hubUrl,
        userId,
        token
    ) => {

        const existingConnection =
            connections[hubName];

        // Already connected
        if (
            existingConnection &&
            existingConnection.state ===
            signalR.HubConnectionState.Connected
        ) {
            return existingConnection;
        }

        // Connection is already starting
        if (connectionPromises[hubName]) {
            return connectionPromises[hubName];
        }

        // Create connection only once
        if (!existingConnection) {

            const connection =
                new signalR.HubConnectionBuilder()
                    .withUrl(
                        `${hubUrl}?userId=${userId}&token=${token}`,
                        {
                            transport:
                                signalR.HttpTransportType.WebSockets
                        }
                    )
                    .withAutomaticReconnect([
                        0,
                        2000,
                        5000,
                        10000,
                        30000
                    ])
                    .build();


            // Register lifecycle events

            connection.onreconnecting(error => {

                // console.warn(
                //     `${hubName} reconnecting`,
                //     error
                // );

                showToast(
                    "info",
                    `${hubName} reconnecting...`
                );
            });

            connection.onreconnected(connectionId => {

                // console.info(
                //     `${hubName} reconnected`,
                //     connectionId
                // );

                showToast(
                    "success",
                    `${hubName} reconnected`
                );
            });

            connection.onclose(error => {

                // console.warn(
                //     `${hubName} disconnected`,
                //     error
                // );

                showToast(
                    "warning",
                    `${hubName} disconnected`
                );
            });

            connections[hubName] = connection;
        }

        const connection = connections[hubName];

        connectionPromises[hubName] = connection
            .start()
            .then(() => {

                // console.info(
                //     `${hubName} connected`
                // );

                showToast(
                    "success",
                    `${hubName} connected`
                );

                return connection;
            })
            .catch(error => {

                // console.error(
                //     `Error connecting to ${hubName}`,
                //     error
                // );

                delete connections[hubName];

                throw error;
            })
            .finally(() => {
                delete connectionPromises[hubName];
            });

        return connectionPromises[hubName];
    };

    /**
     * Subscribe to server event.
     *
     * Returns unsubscribe function.
     */
    const receive = (
        hubName,
        eventName,
        callback
    ) => {

        const connection =
            connections[hubName];

        if (!connection) {

            // console.warn(
            //     `${hubName} connection not found`
            // );

            return () => { };
        }

     

        connection.on(eventName, (...a) => {
            
            callback(a)
        });
      
        return () => {
            connection.off(eventName, callback);
        };
    };

    /**
     * Invoke hub method and wait for response.
     */
    const invoke = async (
        hubName,
        methodName,
        ...args
    ) => {

        const connection =
            connections[hubName];

        if (
            !connection ||
            connection.state !==
            signalR.HubConnectionState.Connected
        ) {
            throw new Error(
                `${hubName} is not connected`
            );
        }

        return await connection.invoke(
            methodName,
            ...args
        );
    };

    /**
     * Send hub method without waiting for response.
     */
    const send = async (
        hubName,
        methodName,
        ...args
    ) => {

        const connection =
            connections[hubName];

        if (
            !connection ||
            connection.state !==
            signalR.HubConnectionState.Connected
        ) {
            throw new Error(
                `${hubName} is not connected`
            );
        }

        return await connection.send(
            methodName,
            ...args
        );
    };

    /**
     * Stop one connection.
     */
    const stop = async (hubName) => {
        // console.log("STOP CALLED:", hubName);
        // console.trace();

        const connection =
            connections[hubName];

        if (!connection)
            return;

        try {

            await connection.stop();

            delete connections[hubName];
            delete connectionPromises[hubName];

            showToast(
                "info",
                `${hubName} stopped`
            );

        } catch (error) {

            // console.error(
            //     `Error stopping ${hubName}`,
            //     error
            // );
        }
    };

    /**
     * Stop all connections.
     */
    const stopAll = async () => {

        const hubNames =
            Object.keys(connections);

        for (const hubName of hubNames) {
            await stop(hubName);
        }
    };

    /**
     * Check connection state.
     */
    const isConnected = (hubName) => {

        return (
            connections[hubName]?.state ===
            signalR.HubConnectionState.Connected
        );
    };

    /**
     * Get raw HubConnection.
     */
    const getConnection = (hubName) => {
        return connections[hubName] ?? null;
    };

    return {
        start,
        receive,
        invoke,
        send,
        stop,
        stopAll,
        isConnected,
        getConnection
    };

})();

export default signalRService;