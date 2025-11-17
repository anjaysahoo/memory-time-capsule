
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
   - No web search allowed

## My App Idea:
- This [Home.tsx](../../frontend/src/pages/Home.tsx) component is landing page contains all details of app idea


## What I Need From You:
1. Analyze the app idea and define:
   - Exact way how we can make modern UI/UX, which resonate with app idea
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

4. Idea here is to make extremely well landing page of current app and then phase wise convert other route with similar UI/UX

Make sure to lock the scope - agents should not add features beyond what you define. Give explicit instructions for file management and agent collaboration.

