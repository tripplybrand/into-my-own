import tw, { css } from 'twin.macro'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { createMachine, assign } from 'xstate'
import { useMachine } from '@xstate/react'

//Increase multiplier make more scroll length between the reveal of each line
const scrollMultiplier = 5
const thresholds = [
  0.0667,
  0.1334,
  0.2001,
  0.2668,
  0.33349999999999996,
  0.4002,
  0.4669,
  0.5336,
  0.6003,
  0.6669999999999999,
  0.7336999999999999,
  0.8004,
  0.8671,
  0.9338,
]

export default function Home() {
  const currentLineNumber = useCurrentLineNumber()

  return (
    <>
      <Head>
        <title>Into My Own</title>
      </Head>
      <div tw="flex justify-center my-0 mx-auto min-h-screen sticky top-0">
        <div tw="py-16 whitespace-nowrap">
          <h1
            css={[
              tw`font-body font-bold text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl`,
              css`
                animation: from-on-to-past 3s forwards ease-out;
                color: #ff90d6;
              `,
            ]}
          >
            Into My Own
          </h1>
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
                  // events: 'SCROLL_ON' | 'SCROLL_PAST' | 'SCROLL_BEFORE'
                  const animationEvent =
                    currentLineNumber === lineNumber
                      ? 'SCROLL_ON'
                      : currentLineNumber > lineNumber
                      ? 'SCROLL_PAST'
                      : currentLineNumber < lineNumber
                      ? 'SCROLL_BEFORE'
                      : null

                  if (animationEvent === null) {
                    throw new Error("animationEvent can't be null")
                  }

                  return (
                    <Line
                      key={line}
                      animationEvent={animationEvent}
                      lastLine={lineNumber === lastLineNumber}
                    >
                      {line}
                    </Line>
                  )
                })}
                {/* add the attribution to the end of the last stanza */}
                {stanzaIdx === stanzas.length - 1 ? (
                  <Attribution
                    animationEvent={
                      currentLineNumber === lastLineNumber
                        ? 'SCROLL_ON'
                        : 'SCROLL_BEFORE'
                    }
                  >
                    — Robert Frost
                  </Attribution>
                ) : null}
              </Paragraph>
            )
          })}
        </div>
      </div>
      <div
        css={[
          tw`invisible w-screen min-h-screen bg-gray-300 top-16`,
          css`
            height: ${100 * scrollMultiplier}vh;
          `,
        ]}
      >
        <p>{null}</p>
      </div>
    </>
  )
}

// Components
function Paragraph({ children }: { children: React.ReactNode }) {
  return <p tw="my-4">{children}</p>
}

// 'SCROLL_ON' | 'SCROLL_PAST' | 'SCROLL_BEFORE'
type AnimationEvent = 'SCROLL_ON' | 'SCROLL_PAST' | 'SCROLL_BEFORE'

function Line({
  children,
  animationEvent,
  lastLine,
}: {
  children: React.ReactNode
  animationEvent: AnimationEvent
  lastLine: boolean
}) {
  const [state, send] = useMachine(
    animationMachine,
    lastLine
      ? {
          actions: {
            fromBeforeToOn: assign({
              animation:
                'from-before-to-on 1s forwards ease-out, from-on-to-past 1s 1s forwards ease-out',
            }),
          },
        }
      : {}
  )

  useEffect(() => {
    send(animationEvent)
  }, [send, animationEvent])

  return (
    <span
      css={[
        tw`block opacity-0 font-body font-medium xs:font-normal text-xs xs:text-lg sm:text-xl md:text-xl lg:text-2xl`,
        css`
          animation: ${state.context.animation};
          color: #ff90d6;
        `,
      ]}
    >
      {children}
    </span>
  )
}

function Attribution({
  children,
  animationEvent,
}: {
  children: React.ReactNode
  animationEvent: Exclude<AnimationEvent, 'SCROLL_PAST'>
}) {
  const [state, send] = useMachine(animationMachine, {
    actions: {
      fromBeforeToOn: assign({
        animation: `attribution-in 1s 0.5s forwards ease-out`,
      }),
      fromOnToBefore: assign({
        animation: `attribution-out 1s forwards ease-out`,
      }),
    },
  })

  useEffect(() => {
    send(animationEvent)
  }, [send, animationEvent])

  return (
    <span
      id="attribution"
      css={[
        tw`block opacity-0 font-body font-normal text-right text-xs xs:text-sm sm:text-base md:text-base lg:text-lg`,
        css`
          animation: ${state.context.animation};
          color: #ff90d6;
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

function useCurrentLineNumber() {
  const [currentLineNumber, setCurrentLineNumber] = useState(-1)

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const { scrollY, innerHeight } = window

      const currentRatio = scrollY / (innerHeight * scrollMultiplier)
      const thresholdIdx = thresholds.findIndex(
        (threshold) => currentRatio <= threshold
      )
      const currentLineNumber =
        thresholdIdx === -1 ? lastLineNumber : thresholdIdx - 1
      setCurrentLineNumber(currentLineNumber)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return currentLineNumber
}

const animationMachine = createMachine(
  {
    context: {
      animation: '',
    },
    initial: 'beforeLine',
    states: {
      beforeLine: {
        on: {
          SCROLL_ON: {
            target: 'onLine',
            actions: 'fromBeforeToOn',
          },
          SCROLL_BEFORE: {},
        },
      },
      onLine: {
        on: {},
      },
      pastLine: {
        on: {
          SCROLL_ON: {
            target: 'onLine',
            actions: 'fromPastToOn',
          },
          SCROLL_PAST: {},
        },
      },
    },
    on: {
      SCROLL_PAST: {
        target: 'pastLine',
        actions: 'fromOnToPast',
      },
      SCROLL_BEFORE: {
        target: 'beforeLine',
        actions: 'fromOnToBefore',
      },
    },
  },
  {
    actions: {
      fromBeforeToOn: assign({
        animation: 'from-before-to-on 1s forwards ease-out',
      }),
      fromOnToPast: assign({
        animation: 'from-on-to-past 1s forwards ease-out',
      }),
      fromOnToBefore: assign({
        animation: 'from-on-to-before 1s forwards ease-out',
      }),
      fromPastToOn: assign({
        animation: 'from-past-to-on 1s forwards ease-out',
      }),
    },
  }
)
