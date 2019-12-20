# Ocarina Project

> Recognize notes and trigger actions based on notes played

There is no guide for this project. Based on the intro to [sound processing](./sound.md) article, are you able to build a system that instead of voice recognition uses musical notes?

The main difference here will be that you'll need to keep track of the notes being played so that you can identify songs. This [file](./zelda.md) contains notes used in different zelda songs. The top level [assets](../../assets) folder has some zelda songs that you can play when one is triggered.

With the water-the-plants project we were able to connect to any device to our Espruino. Are there other devices you want to connect? What about using IFTTT triggers to control the lights or trigger find your phone? Maybe using speech synthesis to get information about the weather, and time?

## Goals

- Use frequencies (musical notes) instead of wake words as triggers
- Trigger multiple actions
- Convert sounds into frequencies
- Use Speech Synthesis

## Materials

- Ocarina
- Raspberry Pi
- Espruino Wifi and any devices you want to connect

## Prerequisites

- To understand how to identify notes, we should have an understanding of sound processing. You can find a quick intro [here](./sound.md).
- Water-the-plants project
- IFTTT triggers project

## References

If you want to dig deeper into the topics covered in this project or want some reference material, the following links may be useful:

- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Audacity](https://www.audacityteam.org/)
