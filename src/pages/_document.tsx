import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'
import Image from 'next/image'
import tw from 'twin.macro'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            href="/fonts/Proza_Libre/proza-libre-v5-latin-regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/Proza_Libre/proza-libre-v5-latin-700.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
        </Head>
        <body>
          <div tw="fixed h-screen w-screen overflow-hidden">
            <Image
              src="/Pink_Line_Dusty.jpg"
              alt="Pine forest with pink ribbon."
              layout="fill"
              objectFit="cover"
              quality={100}
              loading="eager"
              priority={false}
            />
          </div>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
