
I need you to help me build an app using specialized AI agents in a structured workflow.

## Context:
I have a repository of AI agents that can work together. Here's the agent data:
[agents](../../.claude/agents)

## How Agent Workflows Work:
Agents collaborate using this syntax:
> First use the [agent-name] to [task], then use the [agent-name] to [next task]

## Requirements:
1. I'll give you landing page contains details of my app idea you need to:
    - Define the exact features and scope
    - Design an appropriate file structure for agent context sharing
    - Create a 3-phase development workflow

2. The phases should follow this pattern:
    - Phase 1: UX & Planning
    - Phase 2: UI Design
    - Phase 3: Frontend Development

3. Key Constraints:
    - UX agent only decides positioning/layout of YOUR defined features
    - Each agent must save outputs and read from previous agents
    - Agents need clear handoff instructions
    - Include polished UI and micro-interactions

## My App Idea:
- This [Home.tsx](../../frontend/src/pages/Home.tsx) component is landing page contains all details of app idea


## What I Need From You:
1. Analyze the hero section of landing page using 'chrome-devtools' MCP and define:
    - Exact way how we can make [Open.tsx](../../frontend/src/pages/Open.tsx) to have same vibe and look & feel
    - Leverage ShadCN MCP for analyzing right component from different registry for achieving this
    - Support both on Web and mobile
    - EXACT features to be built (detailed scope)
    - Tech stack confirmation
    - Appropriate file structure for this project

2. Create an initial setup prompt for the file structure you design

3. Generate detailed prompts for each phase that include:
    - Which agents to use and in what order
    - Exactly what each agent should build (based on your scope)
    - Where to save their outputs
    - Where to read previous outputs
    - How to update handoff documentation

4. Idea here is to make extremely well capsule page which make recipient of capsule feel delighted when they open it

Make sure to lock the scope - agents should not add features beyond what you define. Give explicit instructions for file management and agent collaboration.

Below are the credential of a user, that can be used to inspect
{"state":{"userId":"239598848","session":{"userId":"239598848","githubLogin":"anjaysahoo4-collab","githubName":null,"githubEmail":null,"githubAvatar":"https://avatars.githubusercontent.com/u/239598848?v=4","repoName":"timecapsule-storage-6133db7d","repoFullName":"anjaysahoo4-collab/timecapsule-storage-6133db7d","repoUrl":"https://github.com/anjaysahoo4-collab/timecapsule-storage-6133db7d","githubConnected":true,"gmailConnected":true,"gmailEmail":"anjaysahoo4@gmail.com","createdAt":"2025-11-15T15:42:07.833Z"}},"version":0}

One Capsule: `/open?t=mOJluod4gJNwk2OoBEx1NQ`
Pin: 9234
