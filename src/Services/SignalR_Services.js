import * as signalR from "@microsoft/signalr"

// Toast configuration using SweetAlert2
// const Toast = Swal.mixin({
//     toast: true,
//     position: "bottom-end",
//     showConfirmButton: false,
//     timer: 3000,
//     timerProgressBar: true,
//     didOpen: (toast) => {
//         toast.onmouseenter = Swal.stopTimer;
//         toast.onmouseleave = Swal.resumeTimer;
//     }
// });

// SignalR Service Module
const signalRService = (function () {
    let connection = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    /**
     * Displays a toast notification.
     * @param {string} icon - The icon type (success, error, info, warning).
     * @param {string} title - The message to display.
     */
    const showToast = (icon, title) => {
        // Toast.fire({ icon, title });
        //console.log({ icon, title });
    };

    /**
 * Starts the SignalR connection.
 * @param {string} hub - The SignalR hub URL.
 * @returns {Promise<void>} Resolves when the connection is established or rejects if an error occurs.
 */
    const startConnection = async function (hub = "/notificationsHub",id="", token = "") {
        // If already connected, resolve immediately
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
            return Promise.resolve(-1);
        }

        // Build the connection
        connection = new signalR.HubConnectionBuilder()
            .withUrl(`${hub}?userId=${id}&token=${token}`,{
                transport: signalR.HttpTransportType.WebSockets
            })
            .build();

        // Start the connection and handle lifecycle events
        return connection.start()
            .then(() => {
                showToast("success", "Connected to the server.");
                reconnectAttempts = 0;

                // Define event handlers only once
                connection.on("ReceiveNotification", (data) => {
                    //console.log("Received notification:", data);
                });

                connection.onclose((err) => {
                    console.error("SignalR connection closed. Attempting to reconnect...", err?.message);
                    showToast("warning", "Connection lost. Trying to reconnect...");
                    handleReconnect();
                });

                connection.onreconnecting(() => {
                    //console.log("Reconnecting SignalR...");
                    showToast("info", "Reconnecting to the server...");
                });

                connection.onreconnected(() => {
                    //console.log("SignalR reconnected successfully!");
                    showToast("success", "Reconnected successfully!");
                    reconnectAttempts = 0;
                });
            })
            .catch((err) => {
                console.error("Error starting connection:", err.message);
                throw new Error("Unable to start connection");
            });
    };

    /**
     * Handles automatic reconnection attempts.
     * @returns {Promise<void>} Resolves if reconnection succeeds or rejects after max attempts.
     */
    const handleReconnect = function () {
        return new Promise(async (resolve, reject) => {
            if (reconnectAttempts < maxReconnectAttempts) {
                reconnectAttempts++;
                const backoff = Math.min(reconnectAttempts * 2000, 10000);

                //console.log(`Reconnect attempt ${reconnectAttempts} in ${backoff / 1000} seconds.`);
                await new Promise(resolve => setTimeout(resolve, backoff)); // Wait for backoff delay

                try {
                    await startConnection();
                    resolve(); // Resolve if connection is successful
                } catch (err) {
                    console.error(`Reconnect attempt ${reconnectAttempts} failed:`, err.message);
                    handleReconnect().then(resolve).catch(reject); // Retry recursively
                }
            } else {
                console.error("Max reconnect attempts reached. Connection failed.");
                showToast("error", "Max reconnect attempts reached. Please check your connection.");
                reject(new Error("Max reconnect attempts reached."));
            }
        });
    };

    /**
     * Registers a callback for a specific SignalR event.
     * @param {string} onEndPointName - The SignalR event name.
     * @param {function} callBack - The callback function to handle the event.
     */
    const receive = (onEndPointName, callBack) => {
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
            connection.off(onEndPointName);
            // //console.log(onEndPointName)
            connection.on(onEndPointName, (res) => {
                // //console.log("vnjn");

                if (typeof callBack === "function") {
                    callBack(res);
                } else {
                    console.warn("No valid callback function provided.");
                }
            });
        }
    };

    /**
     * Stops the SignalR connection.
     */
    const stopConnection = function () {

        if (connection) {
            connection.stop()
                .then(() => {
                    //console.log("SignalR connection stopped.");
                    showToast("info", "Connection stopped.");
                })
                .catch((err) => {
                    console.error("Error stopping SignalR:", err.message, err.stack);
                });
        }
    };

    /**
     * Checks if the SignalR connection is active.
     * @returns {boolean} - True if connected, otherwise false.
     */
    const isConnected = function () {
        return connection && connection.state === signalR.HubConnectionState.Connected;
    };

    // Expose public methods
    return {
        start: startConnection,
        receive,
        stop: stopConnection,
        isConnected: isConnected,
    };
})();

export default signalRService