/**
 * Created by MrTrustworthy on 04.08.2015.
 */

var socketevents =  {
    // those are socket events to emit/listen to
    SOCKET_PATH: "/game",
    SOCKET_PATH_NOSLASH: "game",

    PORT: "61768",

    CONNECT: "connect",
    CONNECTION: "connection",

    SESSION_START: "session_start",

    DISCONNECT: "disconnect",

    MESSAGE: "message_from_server",

    MATCHMAKING: {
        LEAVE_MATCHMAKING: "leave_matchmaking",
        MATCH_FOUND: "match_found",
        JOIN_MATCHMAKING: "join_matchmaking"
    },

    ACTIVITY: {
        INIT_VIEW: "init_view",
        UPDATE_VIEW: "update_view",
        NEW_INPUT: "new_input"
    },
    CLIENT: {
        CLICKED_ON_OBJECT: "clicked_on_object",
        SELECTION_CHANGED: "selection_changed",
        CLICKED_ON_ACTION: "clicked_on_action",
        CLICKED_RIGHT: "clicked_right"
    },
    COMMAND: {
        END_TURN: "end_turn",
        BUILD: "build",
        ATTACK: "attack",
        IMPROVE: "improve"
    }

};

module.exports = socketevents;