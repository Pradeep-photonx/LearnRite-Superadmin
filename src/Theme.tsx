import { createTheme } from "@mui/material/styles";
import type { CSSProperties } from "react";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    r12: CSSProperties;
    r14: CSSProperties;
    r16: CSSProperties;
    r20: CSSProperties;
    r32: CSSProperties;
    m12: CSSProperties;
    m14: CSSProperties;
    m16: CSSProperties;
    m18: CSSProperties;
    m20: CSSProperties;
    m24: CSSProperties;
    m28: CSSProperties;
    m32: CSSProperties;
    sb12: CSSProperties;
    sb14: CSSProperties;
    sb16: CSSProperties;
    sb18: CSSProperties;
    sb20: CSSProperties;
    sb24: CSSProperties;
    sb26: CSSProperties;
    sb32: CSSProperties;
    sb40: CSSProperties;
    sb50: CSSProperties;
    b20: CSSProperties;
    b18: CSSProperties;
    b14: CSSProperties;
    b16: CSSProperties;
  }

  interface TypographyVariantsOptions {
    r12?: CSSProperties;
    r14?: CSSProperties;
    r16?: CSSProperties;
    r20?: CSSProperties;
    r32?: CSSProperties;
    m12?: CSSProperties;
    m14?: CSSProperties;
    m16?: CSSProperties;
    m18?: CSSProperties;
    m20?: CSSProperties;
    m24?: CSSProperties;
    m28?: CSSProperties;
    m32?: CSSProperties;
    sb12?: CSSProperties;
    sb14?: CSSProperties;
    sb16?: CSSProperties;
    sb18?: CSSProperties;
    sb20?: CSSProperties;
    sb24?: CSSProperties;
    sb26?: CSSProperties;
    sb32?: CSSProperties;
    sb40?: CSSProperties;
    sb50?: CSSProperties;
    b20?: CSSProperties;
    b18?: CSSProperties;
    b14?: CSSProperties;
    b16?: CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    r12: true;
    r14: true;
    r16: true;
    r20: true;
    r32: true;
    m12: true;
    m14: true;
    m16: true;
    m18: true;
    m20: true;
    m24: true;
    m28: true;
    m32: true;
    sb12: true;
    sb14: true;
    sb16: true;
    sb18: true;
    sb20: true;
    sb24: true;
    sb26: true;
    sb32: true;
    sb40: true;
    sb50: true;
    b20: true;
    b18: true;
    b14: true;
    b16: true;
  }
}

const fonts = [
  '"Figtree"',
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
];

const FontFamily = fonts.join(",");

const fontWeightStyles = {
  regular: {
    fontWeight: 400,
  },
  medium: {
    fontWeight: 500,
  },
  semiBold: {
    fontWeight: 600,
  },
  bold: {
    fontWeight: 700,
  },
};

const fontStyles = {
  r12: {
    ...fontWeightStyles.regular,
    fontSize: "12px",
    lineHeight: "21px",
  },
  r14: {
    ...fontWeightStyles.regular,
    fontSize: "14px",
    lineHeight: "21px",
  },
  r16:{
    ...fontWeightStyles.regular,
    fontSize: "14px",
    lineHeight: "21px",
  }
  ,
  r20 : {
    ...fontWeightStyles.regular,
    fontSize: "20px",
    lineHeight: "30px",
  }
  ,
  r32:{
    ...fontWeightStyles.regular,
    fontSize: "32px",
    lineHeight: "48px",
  },
  m12: {
    ...fontWeightStyles.medium,
    fontSize: "12px",
    lineHeight: "12px",
  },
  m14: {
    ...fontWeightStyles.medium,
    fontSize: "14px",
    lineHeight: "21px",
  },
  m16: {
    ...fontWeightStyles.medium,
    fontSize: "16px",
    lineHeight: "24px",
  },
  m18: {
    ...fontWeightStyles.medium,
    fontSize: "18px",
    lineHeight: "28px",
  },
  m20: {
    ...fontWeightStyles.medium,
    fontSize: "20px",
    lineHeight: "28px",
  },
  m24: {
    ...fontWeightStyles.medium,
    fontSize: "24px",
    lineHeight: "100%",
  },
  m28: {
    ...fontWeightStyles.medium,
    fontSize: "28px",
    lineHeight: "38px",
  },
  m32: {
    ...fontWeightStyles.medium,
    fontSize: "32px",
    lineHeight: "40px",
  },
  sb12: {
    ...fontWeightStyles.semiBold,
    fontSize: "12px",
    lineHeight: "22px",
  },
  sb14: {
    ...fontWeightStyles.semiBold,
    fontSize: "14px",
    lineHeight: "21px",
  },  
  sb16: {
    ...fontWeightStyles.semiBold,
    fontSize: "16px",
    lineHeight: "24px",
  },
  sb18: {
    ...fontWeightStyles.semiBold,
    fontSize: "18px",
    lineHeight: "28px",
  },
  sb24: {
    ...fontWeightStyles.semiBold,
    fontSize: "24px",
    lineHeight: "34px",
  },
  sb26: {
    ...fontWeightStyles.semiBold,
    fontSize: "26px",
    lineHeight: "36px",
  },
  sb32:{
    ...fontWeightStyles.semiBold,
    fontSize: "32px",
    lineHeight: "42px",
  },
  sb40: {
    ...fontWeightStyles.semiBold,
    fontSize: "40px",
    lineHeight: "48px",
  },
  sb50: {
    ...fontWeightStyles.semiBold,
    fontSize: "50px",
    lineHeight: "58px",
  },
  sb20: {
    ...fontWeightStyles.semiBold,
    fontSize: "20px",
    lineHeight: "28px",
  },
  b20: {
    ...fontWeightStyles.bold,
    fontSize: "20px",
    lineHeight: "30px",
  },
  b18: {
    ...fontWeightStyles.bold,
    fontSize: "18px",
    lineHeight: "26px",
  },
  b14: {
    ...fontWeightStyles.bold,
    fontSize: "14px",
    lineHeight: "21px",
  },
  b16: {
    ...fontWeightStyles.bold,
    fontSize: "16px",
    lineHeight: "21px",
  },
};

const baseTheme = createTheme({
  spacing: (num: number) => num * 5,
  palette: {
    text: {
      primary: "#121318",
      secondary: "#445061",
    },
    primary: {
      main: "#2C65F9", // Solid color for text elements
    },
    secondary: {
      main: "#FAB446",
      light: '#FFF8ED',
    },
    success: {
      main: "#238339",
      light: '#89BF95',
    },
    warning: {
      main: "#FAB446",
      light: '#89BF95',
    },
    error: {
      main: "#E24600",
      light: '#89BF95',
    },
    info: {
      main: "#A10007",
    },
  },
  typography: {
    ...fontStyles,
    fontFamily: FontFamily,
    h1: {
      fontSize: "56px",
      fontWeight: 500,
      lineHeight: "64px",
      color: "#121318",
    },
    h2: {
      ...fontStyles.b18,
    },
    h3: {
      ...fontStyles.b16,
    },
    h4: {
      ...fontStyles.b14,
    },
    h5: {
      ...fontStyles.b16,
    },
    h6: {
      ...fontStyles.m14,
    },
    subtitle1: {
      ...fontStyles.r14,
    },
    subtitle2: {
      ...fontStyles.sb14,
    },
    body1: {
      ...fontStyles.m14,
    },
    body2: {
      ...fontStyles.m12,
    },
    caption: {
      fontSize: "10px",
    },
  },
});
const theme = createTheme(baseTheme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          ...fontStyles.r14,
          color: baseTheme.palette.text.primary,
          height: "100%",
          minHeight: "fit-content",
          width: "100%",
          backgroundColor: "#FFFFFF",
          WebkitTextSizeAdjust: "100%",
          MozTextSizeAdjust: "100%",
          textSizeAdjust: "none",
        },
        "#root": {
          height: "100%",
          width: "100%",
          boxSizing: "border-box",
          position: "relative",
          backgroundColor: "#FFFFFF",
        },
        html: {
          backgroundColor: "#FFFFFF",
          scrollBehavior: "smooth",
        },
        a: {
          textDecoration: "none",
          color: "inherit",
          "&:hover": {
            color: "inherit",
          },
          "&:visited": {
            color: "inherit",
          },
        },
        "input[type=number]::-webkit-inner-spin-button, &input[type=number]::-webkit-outer-spin-button":
          {
            WebkitAppearance: "none",
            margin: 0,
          },
        "input[type=number]": {
          MozAppearance: "textfield",
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
      
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "initial",
          padding: "10px 15px",
          minWidth: "136px",
          ...fontStyles.m14,
          borderRadius: "10px",
          fontSize: "14px !important",
          fontWeight: 500,
          "&:focus": {
            outline: "none !important",
          },
        },
        text: {
          padding: 0,
          minWidth: "auto",
        },
        contained: {
          background: "linear-gradient(98.42deg, #2C65F9 10.23%, #2C55C1 80.76%)",
          boxShadow: "0px 0px 20px 0px #BFC2C833",

          color: "#ffffff",
          "&:hover": {
            background: "linear-gradient(98.42deg, #2C65F9 10.23%, #2C55C1 80.76%)",
            // opacity: 0.9,
          },
        },
      },
    },
    MuiRating:{
      styleOverrides: {
        root: {
          color: baseTheme.palette.success.main,
        }
      }
    },
    MuiStepLabel:{
      styleOverrides: {
        alternativeLabel:{
          marginTop: '5px !important',
        },
        label:{
          ...baseTheme.typography.b14,
          marginTop: '5px !important',
          '&.Mui-active':{
            ...baseTheme.typography.b14,
            color: baseTheme.palette.primary.main,
          },
          '&.Mui-completed':{
            ...baseTheme.typography.b14,
            color: baseTheme.palette.primary.main,
          }
        },
        root: {
          color: baseTheme.palette.success.main,
        }
      }
    },
    MuiSnackbar:{
      styleOverrides: {
        root: {
          zIndex: 99999999999,
        },
      }
    },
    MuiAlert:{
      styleOverrides: {
        message:{
          lineHeight: '18px',
        },
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          height: "48px",
          fontSize: "16px",
          fontFamily: FontFamily,
          // border: "1px solid #202228",
          backgroundColor: "#FFFFFF",
          "& fieldset": {
            borderColor: "#D1D4DE",
          },
          "&:hover fieldset": {
            borderColor: "#D1D4DE",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#2C65F9",
          },
          "&.Mui-disabled": {
            backgroundColor: "#F9FAFB",
            color: "#6B7280",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#9CA3AF",
            opacity: 1,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          border: "1px solid #CFCDCD4D",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 0px 30px 0px #0000000F",
          padding: "20px",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          width: "100%",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 500,
            fontSize: "14px",
            color: "#121318",
            borderBottom: "1px solid #1213181A",
            padding: "10px 15px",
            backgroundColor: "#F9FAFB",
            "&:first-child": {
              borderTopLeftRadius: "12px !important",
            },
            "&:last-child": {
              borderTopRightRadius: "12px !important",
            },
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-body": {
            borderBottom: "1px solid #1213181A",
            padding: "20px 16px 10px 16px",
            fontSize: "16px",
            fontWeight: "500",
            color: "#121318",
            "&:focus": {
              outline: "none !important",
            },
            "&:hover": {
              backgroundColor: "unset !important",
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          "&:first-child td": {
            borderTopLeftRadius: "12px !important",
          },
          "&:last-child td": {
            borderTopRightRadius: "12px !important",
            borderBottom: "none",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: FontFamily,
        },
        head: {
          fontWeight: 600,
          fontSize: "14px",
          color: "#121318",
        },
        body: {
          fontSize: "14px",
          color: "#121318",
        },
      },
    },
    
  },
  breakpoints: {
    values: {
      xs: 360,
      s: 470,
      sm: 600,
      m: 960,
      md: 1024,
      l: 1100,
      lg: 1248,
      xl: 1440,
      xxl: 1920,
    },
  },
});
export default theme;
