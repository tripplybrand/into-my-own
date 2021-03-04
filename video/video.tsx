import { Composition } from 'remotion'
import { GlobalStyles } from 'twin.macro'
import { HelloWorld } from './hello-world'

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={17 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: 'Welcome to Remotion',
          titleColor: 'black',
        }}
      />
    </>
  )
}
