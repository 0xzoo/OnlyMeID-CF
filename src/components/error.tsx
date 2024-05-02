/** @jsxImportSource frog/jsx */

export function errorScreen(error: string) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <img
        height='630px'
        width='1200px'
        src='https://github.com/0xzoo/OnlyMeID/raw/main/public/rosso.jpg'
      />
      <text
        style={{
          fontSize: '60px',
          marginTop: '-30%'
        }}
      >
        {error}
      </text>
    </div>
  )
}