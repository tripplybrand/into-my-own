/** @jsxImportSource @emotion/react */
import tw, { css, GlobalStyles } from 'twin.macro'
import { spring, useCurrentFrame, useVideoConfig, Img } from 'remotion'
import img from '../public/Pink_Line_Dusty.jpg'

export const HelloWorld: React.FC<{
  titleText: string
  titleColor: string
}> = ({ titleText, titleColor }) => {
  const videoConfig = useVideoConfig()
  const frame = useCurrentFrame()
  const text = titleText.split(' ').map((t) => ` ${t} `)

  return (
    <>
      <div
        css={[
          css`
            z-index: -1;
          `,
          tw`fixed w-full h-full overflow-hidden`,
        ]}
      >
        <div tw="block overflow-hidden absolute inset-0 box-border m-0">
          <Img
            src={img}
            alt="Pine forest with pink ribbon."
            css={[
              tw`box-border absolute inset-0 block object-cover w-0 h-0 max-w-full max-h-full min-w-full min-h-full p-0 m-auto border-none`,
              css`
                visibility: inherit;
              `,
            ]}
          />
        </div>
      </div>
      <GlobalStyles />
    </>
  )
}
