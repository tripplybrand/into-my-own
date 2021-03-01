import tw, { css } from 'twin.macro'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { createMachine, assign } from 'xstate'
import { useMachine } from '@xstate/react'

export default function Home() {
  const currentLineNumber = useCurrentLineNumber()

  return (
    <>
      <Head>
        <title>Into My Own</title>
      </Head>
      <div
        id="textContainer"
        css={[
          tw`flex justify-center min-h-screen my-0 mx-auto`,
          css`
            height: 100vh;
          `,
        ]}
      >
        <div
          css={[
            tw`fixed top-16 left-2/4 whitespace-nowrap h-screen`,
            css`
              transform: translate(-50%);
            `,
          ]}
        >
          <h1
            css={[
              tw`font-body font-bold`,
              css`
                animation: from-on-to-past 3s forwards ease-out;
                font-size: 2.5rem;
              `,
            ]}
          >
            Into My Own
          </h1>
          {stanzas.map((lines, stansaIdx) => {
            const previousStanzas = stanzas.slice(0, stansaIdx)
            const previousLineNum = previousStanzas.reduce(
              (totalLines, linesInStanza) => totalLines + linesInStanza.length,
              0
            )
            return (
              <Paragraph key={stansaIdx}>
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
                {stansaIdx === stanzas.length - 1 ? (
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
        id="scrollRoot"
        css={[
          tw`min-h-screen bg-red-300`,
          css`
            height: 150vh;
          `,
        ]}
      >
        <div
          id="scrollBox"
          css={[
            tw`min-h-screen bg-gray-300 bg-opacity-100 top-16 w-1/2`,
            css`
              height: 100vh;
            `,
          ]}
        >
          <p>{null}</p>
        </div>
      </div>
    </>
  )
}

// Components

function Paragraph({ children }) {
  return <p tw="my-4">{children}</p>
}

// 'SCROLL_ON' | 'SCROLL_PAST' | 'SCROLL_BEFORE'
function Line({ children, animationEvent, lastLine }) {
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
      className="appear"
      css={[
        tw`font-body block font-normal opacity-0`,
        css`
          animation: ${state.context.animation};
          font-size: 1.2rem;
          color: #ff90d6;
        `,
      ]}
    >
      {children}
    </span>
  )
}

function Attribution({ children, animationEvent }) {
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
        tw`font-body block font-normal text-right opacity-0`,
        css`
          animation: ${state.context.animation};
          font-size: 0.9rem;
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
    const scrollBox = document.querySelector('#scrollBox')

    const options = {
      root: document.querySelector('#scrollRoot'),
      threshold: [
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
      ],
    }

    const observer = new IntersectionObserver(handleIntersect, options)
    observer.observe(scrollBox)

    function handleIntersect(entry, observer) {
      const currentRatio = entry[0].intersectionRatio

      const thresholdIdx = options.threshold.findIndex(
        (threshold) => currentRatio <= threshold
      )
      const currentLineNumber =
        thresholdIdx === -1 ? lastLineNumber : thresholdIdx - 1

      setCurrentLineNumber(currentLineNumber)
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
