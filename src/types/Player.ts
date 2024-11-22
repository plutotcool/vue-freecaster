export interface Player extends HTMLVideoElement {
  /**
   * Returns a string containing the current timecode
   */
  currentTimecode: string

  /**
   * Returns an integer of the current timestamp (UTC) in milliseconds.
   * This feature only works for DASH or HLS playlists with non-native
   * configuration.
   */
  currentTimestamp: number

  /**
   * Whether the video is a live feed
   */
  live: boolean

  /**
   * Player's container HTMLElement
   */
  container: HTMLElement

  /**
   * Current player version
   */
  version: string

  /**
   * Update the player's config
   */
  setConfig(config: any): void
  setConfig(key: string, value: any): void

  /**
   * Player config
   */
  config: any

  /**
   * Load a new video from the API, replacing the current video
   * @param id Video ID
   */
  loadVideo(id: string): void

  /**
   * Destroy the player instance and remove the element from the DOM
   */
  destroy(): void

  /**
   * Jump toward the provided time
   * @param time Time to jump to in seconds or as a timestamp
   */
  seek(time: number): void


  /**
   * Toggle fullscreen mode
   */
  toggleFullScreen(): void

  /**
   * Toggle play/pause mode
   */
  togglePlay(): void

  /**
   * Replaces the current source
   * @param source New source
   */
  setSrc(source: string): void

  /**
   * Seek closer to live
   */
  goBackToLive(): void
}

export type PlayerEvents = {
  // Standard video events
  abort: [event: Event]
  canplay: [event: Event]
  canplaythrough: [event: Event]
  durationchange: [event: Event]
  emptied: [event: Event]
  encrypted: [event: Event]
  ended: [event: Event]
  error: [event: Event]
  load: [event: Event]
  loadeddata: [event: Event]
  loadedmetadata: [event: Event]
  loadstart: [event: Event]
  pause: [event: Event]
  play: [event: Event]
  playing: [event: Event]
  progress: [event: Event]
  ratechange: [event: Event]
  seeked: [event: Event]
  seeking: [event: Event]
  stalled: [event: Event]
  suspend: [event: Event]
  timeupdate: [event: Event]
  volumechange: [event: Event]
  waiting: [event: Event]
  waitingforkey: [event: Event]
  enterpictureinpicture: [event: PictureInPictureEvent]
  leavepictureinpicture: [event: PictureInPictureEvent]
  resize: [event: Event]

  // Freecaster player events

  /**
   * Fired when the player enters fullscreen
   */
  fullscreenenter: [event: Event]

  /**
   * Fired when the player exits fullscreen
   */
  fullscreenxit: [event: Event]

  /**
   * Fired when the player is viewable in the browser viewport
   */
  viewenter: [event: Event]

  /**
   * Fired when the player is not viewable anymore in the browser viewport
   */
  viewleave: [event: Event]

  /**
   * Fired when the player instance is destroyed
   */
  fcplayerDestroy: [event: Event]

  /**
   * Fired when the video source has changed
   */
  fcplayerSrcChanged: [event: Event]

  /**
   * Fired each countdown seconds
   */
  fcplayerCountdownTick: [event: Event]

  /**
   * Fired when the countdown is enabled
   */
  fcplayerCountdownEnabled: [event: Event]

  /**
   * Fired when the countdown is disabled
   */
  fcplayerCountdownDisabled: [event: Event]

  /**
   * Fired when the countdown is over
   */
  fcplayerCountdownZero: [event: Event]
}

export interface PlayerOptions {
  /**
   * ID of the video
   * @default undefined
   */
  videoId?: string

  /**
   * Set the height of the player
   * @default undefined
   */
  height?: number

  /**
   * Set the width of the player.
   * @default undefined
   */
  width?: number

  /**
   * Set the volume percentage of the player. The value used must be between
   * 0 and 1 (see MDN). If the user specifically muted the sound, it will not
   * "force" the next time he loads the player. There are limitations when used
   * along with autoplay: See Google article for more information.
   * @default undefined
   */
  volume?:  number

  /**
   * false Enable/disable the autoplay. There are limitations when used along
   * with autoplay (See Google article for more information) You must set
   * muted="true" in to be sure for it to work.
   * @default false
   */
  autoplay?:  boolean

  /**
   * Enabled/disabled the automatic pause when the player is no longer visible
   * in the viewport.
   * @default true
   */
  autopause?: boolean

  /**
   * Enable/disable the control bar.
   * @default true
   */
  controls?:  boolean

  /**
   * Enable/disable sound.
   * @default false
   */
  muted?: boolean

  /**
   * If set to true, the video will start over upon ending.
   * @default false
   */
  loop?:  boolean

  /**
   * Enable/disable Chromecast/AirPlay.
   * @default false
   */
  cast?:  boolean

  /**
   * Enable/disable the watermark.
   * @default false
   */
  watermarkEnabled?: boolean

  /**
   * The lang provided by the user (language-country (RFC 5646)).
   * @default undefined
   */
  lang?: string

  /**
   * Trackers (such as Google Analytics, Mux, Youbora, ...) will be enabled.
   * @default false
   */
  stats?: boolean

  /**
   * Enable/disabled advertising.
   * @default false
   */
  noads?: boolean

  /**
   * Set specific thumbnails.
   * @default undefined
   */
  thumbnailsSrc?: string

  /**
   * Set a specific poster.
   * @default undefined
   */
  poster?: string

  /**
   * Resize poster and video to fit player dimensions.
   * 'fill' Fit player dimensions without maintaining aspect ratio.
   * 'cover' Zoom and crop video to fill dimensions, maintaining aspect ratio.
   * 'none' Display the actual size of the video file. (Black borders).
   * @default false
   */
  stretching?: 'fill' | 'cover' | 'none' | false

  /**
   * Set an active subtitle from the desired language (2 letter ISO-639-1 code).
   * @default false
   */
  subtitlesDefaultLang?: string

  /**
   * Only show the specified language (2 letter ISO-639-1 code).
   * @default undefined
   */
  subtitlesLang?: string

  /**
   * Enable subtitles to be rendered by the browser supporting inline style or
   * CSS rules within VTT file.
   * @default false
   */
  subtitlesNative?: boolean

  /**
   * When enabled, a floating video container will be displayed when the user
   * scroll past the player.
   * @default false
   */
  floatOnScroll?: boolean

  /**
   * Whether the player should pause if another player begins playback.
   * @default false
   */
  multiplay?: boolean

  /**
   * Enable/disable chapters.
   * @default false
   */
  chaptersEnabled?: boolean

  /**
   * Specify the style to use for the timeline's cuepoints.
   * @default 'hidden'
   */
  chaptersStyle?: 'hidden' | 'dot' | 'full_width'

  /**
   * The list of chapters.
   * @default []
   */
  chaptersList?: string[]

  /**
   * Enable/disable minimal player UI.
   * @default false
   */
  audioOnly?: boolean

  /**
   * Enable Google Analytics (GA4) support. By default, window.dataLayer will be
   * used to push events toward GA4.
   * @default false
   */
  trackersGaEnabled?: boolean

  /**
   * Add Google Analytics (GA4) tag IDs to track.
   * @default undefined
   */
  trackersGaTagIds?: string[]

  /**
   * List of speed factors
   * @default [0.2,0.5,1,2,10]
   */
  speedOptions?: number[]

  /**
   * List of speed labels
   * @default undefined
   */
  speedLabels?: string[]
}
