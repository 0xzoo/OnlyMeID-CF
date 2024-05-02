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
        <text
          style={{
            fontSize: '60px',
            marginTop: '-30%'
          }}
        >Claim your OnlyMeID rewards</text>
      </div>
    ),
    intents: [
      <Button action='/start'>Verify</Button>,
      <Button.Link href='https://app.demos.global'>Mint an OnlyMeID</Button.Link>
    ]
  })
}