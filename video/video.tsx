import { Composition } from 'remotion'
import { GlobalStyles } from 'twin.macro'
import IntoMyOwn from './into-my-own'

export default function RemotionVideo() {
  return (
    <>
      <GlobalStyles />
      <Composition
        id="into-my-own"
        component={IntoMyOwn}
        durationInFrames={17 * 30} // This could probably be more data driven, but whatever
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  )
}
