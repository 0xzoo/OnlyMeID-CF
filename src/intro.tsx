import {
  Button,
  FrameContext,
  FrameHandler,
} from 'frog'


export const introScreen: FrameHandler = async (c: FrameContext) => {

  return c.res({
    image: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          color: '#FFFFFF'
        }}
      >
        <img
          height='630px'
          width='1200px'
          src='https://github.com/0xzoo/OnlyMeID/raw/main/public/nero.jpg'
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '-33%'
          }}
        >
          <text
            style={{
              fontSize: '60px',
              marginBottom: '10px'
            }}
          >
            FREE $DEGEN for humans only
          </text>
          <text
            style={{
              fontSize: '45px',
            }}
          >
            Get your OnlyMeID to get started
          </text>
        </div>
      </div>
    ),
    intents: [
      <Button action='/start'>Verify</Button>,
      <Button.Link href='https://app.demos.global'>Mint an OnlyMeID</Button.Link>
    ]
  })
}