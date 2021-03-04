/** @jsxImportSource @emotion/react */
import tw, { css, GlobalStyles } from 'twin.macro'
import { useCurrentFrame, Img, interpolate, Easing } from 'remotion'
import { interpolateRgb } from 'd3-interpolate'

import img from '../public/Pink_Line_Dusty.jpg'

const fadeInDuration = 30
const colorChangeDuration = 30
const colorInterpolation = interpolateRgb('#ff90d6', '#f5faff')

export function HelloWorld() {
  return (
    <>
      <BackgroundImage />
      <GlobalStyles />
      <Poem />
    </>
  )
}

function BackgroundImage() {
  return (
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
  )
}

export default function Poem() {
  return (
    <div tw="flex justify-center my-0 mx-auto min-h-screen sticky top-0">
      <div tw="py-16 whitespace-nowrap">
        <Header>Into My Own</Header>
        {stanzas.map((lines, stanzaIdx) => {
          const previousStanzas = stanzas.slice(0, stanzaIdx)
          const previousLineNum = previousStanzas.reduce(
            (totalLines, linesInStanza) => totalLines + linesInStanza.length,
            0
          )
          return (
            <Paragraph key={stanzaIdx}>
              {lines.map((line, lineIdx) => {
                const lineNumber = previousLineNum + lineIdx
                const startFade = fadeInDuration * (lineNumber + 1)
                const endFade = startFade + fadeInDuration
                return (
                  <Line
                    key={line}
                    fadeInFrames={[startFade, endFade]}
                    colorFrames={[endFade, endFade + colorChangeDuration]}
                  >
                    {line}
                  </Line>
                )
              })}
              {
                // add the attribution to the end of the last stanza
                stanzaIdx === stanzas.length - 1
                  ? (() => {
                      const startFade = fadeInDuration * (lastLineNumber + 2)
                      return (
                        <Attribution
                          fadeInFrames={[startFade, startFade + fadeInDuration]}
                        >
                          — Robert Frost
                        </Attribution>
                      )
                    })()
                  : null
              }
            </Paragraph>
          )
        })}
      </div>
    </div>
  )
}

// Components

function Header({ children }: { children: React.ReactNode }) {
  const color = useColor([0, colorChangeDuration])
  return (
    <h1
      css={[
        tw`text-2xl font-bold font-body sm:text-2xl md:text-4xl lg:text-4xl`,
        css`
          color: ${color};
        `,
      ]}
    >
      {children}
    </h1>
  )
}
function Paragraph({
  children,
}: {
  key?: string | number
  children: React.ReactNode
}) {
  return <p tw="my-4">{children}</p>
}

type LineProps = {
  key?: React.Key // figure out how to imply via tsconfig
  fadeInFrames: [number, number]
  colorFrames: [number, number]
  children: React.ReactNode
}
function Line({ fadeInFrames, colorFrames, children }: LineProps) {
  const color = useColor(colorFrames)
  const opacity = useOpacity(fadeInFrames)

  return (
    <span
      css={[
        tw`block text-xs font-normal font-body sm:text-sm md:text-xl lg:text-xl`,
        css`
          color: ${color};
          opacity: ${opacity};
        `,
      ]}
    >
      {children}
    </span>
  )
}

type AttributionType = {
  fadeInFrames: [number, number]
  children: React.ReactNode
}
function Attribution({ fadeInFrames, children }: AttributionType) {
  const opacity = useOpacity(fadeInFrames)
  return (
    <span
      id="attribution"
      css={[
        tw`block text-xs font-normal text-right opacity-0 font-body sm:text-xs md:text-base lg:text-base`,
        css`
          opacity: ${opacity};
          color: ${colorInterpolation(0)};
        `,
      ]}
    >
      {children}
    </span>
  )
}

// Data

const stanzas = [
  [
    'One of my wishes is that those dark trees,',
    'So old and firm they scarcely show the breeze,',
    'Were not, as ’twere, the merest mask of gloom,',
    'But stretched away unto the edge of doom.',
  ],
  [
    'I should not be withheld but that some day',
    'Into their vastness I should steal away,',
    'Fearless of ever finding open land,',
    'Or highway where the slow wheel pours the sand.',
  ],
  [
    'I do not see why I should e’er turn back,',
    'Or those should not set forth upon my track',
    'To overtake me, who should miss me here',
    'And long to know if still I held them dear.',
  ],
  [
    'They would not find me changed from him they knew',
    'Only more sure of all I thought was true.',
  ],
]

const lastLineNumber = stanzas.flat().length - 1

// Hooks/logic

function useColor(domain: [number, number]) {
  const frame = useCurrentFrame()
  // only interpolate when in the domain
  const input =
    frame < domain[0] ? domain[0] : frame > domain[1] ? domain[1] : frame
  const color = colorInterpolation(
    interpolate(input, domain, [0, 1], {
      easing: Easing.ease,
    })
  )
  return color
}

function useOpacity(domain: [number, number]) {
  const frame = useCurrentFrame()
  // only interpolate when in the domain
  const input =
    frame < domain[0] ? domain[0] : frame > domain[1] ? domain[1] : frame
  const opacity = interpolate(input, domain, [0, 1], {
    easing: Easing.ease,
  })
  return opacity
}
