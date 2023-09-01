# project-starlight-backend

## Scripts
- `npm run dev`: Runs and automatically restarts the server whenever changes are made.
    - Uses nodemon, a tool that watches for file changes in the current directory and subdirectories.
    - When changes are detected, it automatically restarts the specified JavaScript file using the Node.js runtime.
    - This provides a more streamlined development workflow, as you can focus on coding without needing to manually restart the application every time you make changes.
    - Used during development.
- `npm run build`: Cleans the `./build` directory and builds the app into it.
- `npm run start`: Runs the server once.
    - Directly executes the specified JavaScript file using the Node.js runtime. It's a one-time execution, and if you make changes to the code, you need to manually stop and restart the command each time to see the changes take effect.
    - Used in "production".



## Game Flow

### Lobby Screen
- Only one room, on website connect, show lobby screen.
- Random names
- To join lobby, click "join".
- Allow anyone to start the game by clicking the "start" button after 5 players join.

### Game Screen
- Copy MN's UI and logic for standard mode
    - player names in a list (like coup.thebrown), buttons next to player when propping
    - hack/secure screen
    - nodes on the right, color based on hacked/not hacked. Fill in names of players who were propped
    - role in the top left
    - simple vote history on left side (make it better after the MVP)
        - html table, rows will be nodes, columns will be players (reverse from MN)
    - etc.
    - After game ends, how "hackers/agents won"
    - buttton to go back to lobby screen

### Logic
#### Object Design
- Root (/games): Contains data on overall game state
    - /games/game : base game stats
        - player_count: Number of players in the lobby.
        - state: The current state of the game. (Must be one of the below, add more later)
            - STATE_LOBBY
            - STATE_PROPOSAL_PHASE
            - STATE_VOTING_PHASE
        - node: What number node the game is on
        - proposal: What proposal of the node the game is on
        - current_proposer: Who is currently proposing the node
        - proposal_votes_cast: How many people have casted a vote on a proposal
        - proposal: The current proposal to the current node
- Player (/games/game/players): Contains information on each player
    - /games/game/players/{player-id}: Based off of a numerical id, information on each player is stored
        - name: Name of the player.
        - role: The role of the player (more can be added later)
            - ROLE_AGENT
            - ROLE_HACKER
    - /games/game/players/{player-id}/votes/{node-num}
        - vote: Most recent vote of player {player-id} on node {node-num}

#### Standard Client Interaction

1. To start, the app will ask the user to login.
    1. One a fresh new game /games/game have the following values:
        1. player_count: 0
        2. state: STATE_LOBBY
        3. node: 0
        4. current_proposer: 0
2. A player-id is given to that user and its player-id doc is updated in firestore
    1. player_count is incremented
3. They are taken to the lobby screen, where the app lists all ready players
    1. All players with a doc under /games/game/players/ are considered ready
4. When 5 players are ready, the start game appears
    1. Before the state is changed, the following actions are performed
        1. Hackers are decided by RNG
        2. Each players objects are updated with their role
5. When the game state changes to STATE_PROPOSAL_PHASE
    1. The proposer shall make a proposal to advance the game state
6. The proposal shall be voted on and votes will be stored as pressed
    1. When the vote num is equal to the player count, the votes will be considered finalized and game state will be advanced
        1. If the vote passes (majority yes), the node is processed
        2. If the vote does not pass, then talking phase occurs again
7. (This is Node processing phase where people choose whether to hack the node)
8. Repeat until game condition is won
9. If game end condition is met, end the game and show victors
    1. This part is unfinished

### Improvements to MN
- Update to MN: Blind hackers mainframe
- Reskin hackers/agents to something else
- ELO system
- Leaderboard