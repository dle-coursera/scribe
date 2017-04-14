# Scribe
A tool to generate code from Sketch designs

## Installation
1. npm install -g skpm
2. skpm build --watch

For more, read https://www.npmjs.com/package/skpm

## How to use
1. Open the system console by going to `Applications -> Utilities -> Console`
2. Open a Sketch file
3. In Sketch, go to `Plugin -> Scribe -> Generate Component`
4. Observe the logs

## Development
During development, you'll want to communicate with Sketch APIs. Since Sketch is an Objective-c app, we can retrive header files for all of their classes. Use this as reference to find the APIs that you need https://github.com/dle-coursera/sketch-class-dump.

Any class that as a `MS` prefix is a Sketch object ex. `MSArtboard`. Any object that's prefixed as `NS` and `CG` are Apple objects. Ex. `NSDocument` and `CGRect`. Google Apple classes to find relevant documentation for them.
