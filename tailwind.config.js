/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      dropShadow:{
        default: '2px 2px 5px rgba(0,0,0,0.25)',
        default_1: '2px 0px 3px rgba(0,0,0,0.20)',
      },

      fontFamily:{
        heading: ['Cinzel', 'serif'],
        body:['inter','sans']
      },

      colors: {
        primary: '#F3EAE0', //bg
        secondary: '#FFFFFF', //card
        accent: '#2D2314', //button, text
        // accent_2:'#EDE3D6',

        accent_red:'#E29B9C', //chart
        accent_purple:'#B69BE2', //chart
        accent_blue:'#9BBFE2', //chart
        accent_green:'#B9E29B', //chart
        accentLight_ink:'#FFCDF1', //chart

      //   'text':{
      //     50: '#0e0e0b',
      //     100: '#1d1d16',
      //     200: '#39392d',
      //     300: '#565643',
      //     400: '#72725a',
      //     500: '#8f8f70',
      //     600: '#a5a58d',
      //     700: '#bcbca9',
      //     800: '#d2d2c6',
      //     900: '#e9e9e2',
      //     950: '#f4f4f1',
      // },

      // 'background': {
      //     50: '#110909',
      //     100: '#221111',
      //     200: '#442222',
      //     300: '#663333',
      //     400: '#884444',
      //     500: '#aa5555',
      //     600: '#bb7777',
           700: '#cc9999',
      //     800: '#ddbbbb',
      //     900: '#eedddd',
      //     950: '#f6eeee',
      // },

      // 'primary':{
      //     50: '#110e08',
      //     100: '#231b10',
      //     200: '#453621',
      //     300: '#685131',
      //     400: '#8b6c41',
      //     500: '#ad8752',
      //     600: '#be9f74',
      //     700: '#ceb797',
      //     800: '#decfba',
      //     900: '#efe7dc',
      //     950: '#f7f3ee',
      // },

      // 'secondary':{
      //     50: '#120e07',
      //     100: '#241b0f',
      //     200: '#48371e',
      //     300: '#6d522c',
      //     400: '#916d3b',
      //     500: '#b5884a',
      //     600: '#c4a06e',
      //     700: '#d3b892',
      //     800: '#e1d0b7',
      //     900: '#f0e7db',
      //     950: '#f8f3ed',
      // },

      // 'accent':{
      //     50: '#130e06',
      //     100: '#271c0c',
      //     200: '#4e3718',
      //     300: '#745325',
      //     400: '#9b6f31',
      //     500: '#c28b3d',
      //     600: '#cea264',
      //     700: '#dab98b',
      //     800: '#e7d0b1',
      //     900: '#f3e8d8',
      //     950: '#f9f3ec',
      // },

        // 'accent-merah':{
        //     50:'#de2f30',
        //     100:'#e84948',
        //     150:'#f26363'
        // },

        // 'purple':{
        //     50:'#972de0',
        //     100:'#b247ea',
        //     150:'#cd61f3'
        // },

        // 'blue':{
        //     50:'#362ee0',
        //     100:'#5348ea',
        //     150:'#6f60f4'
        // }
      }
    },
  },
  plugins: [],
}