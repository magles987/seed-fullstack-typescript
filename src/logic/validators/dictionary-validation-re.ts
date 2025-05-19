/**diccionario con expresiones regulares comunes para validación de datos*/
export var diccValRE = {
  /**permite todos los caracteres y acentos de los lenguajes
   * (ingles, español, portugues, Frances, italiano, alemán)
   * ademas se signos de puntuación */
  alphaNumFull: /^[0-9A-zÀ-Ÿ\d- ,.:;()$@%*#\'\"+-/=!¡¿?]+$/, //new RegExp("^[0-9A-zÀ-Ÿ\d- ,.:;()$@%*#\'\"+-/=!¡¿?]+$"),
  alphaNumWithSpace: /^[0-9A-zÀ-Ÿ\d- ]+$/,
  alphaNumWithOutSpace: /^[0-9A-zÀ-Ÿ\d-]+$/,
  alpha: /^[A-zÀ-Ÿ\\d-]+$/,
  textNumeric: /^[0-9 ]+$/,
  genericPhone: /^[()0-9 ]+$/,
  genericEmail:
    /^[\w-\.áéíóúÁÉÍÓÚüÜ]{3,}@([\w-áéíóúÁÉÍÓÚüÜ]{2,}\.)*([\w-áéíóúÁÉÍÓÚüÜ]{2,}\.)[\w-áéíóúÁÉÍÓÚüÜ]{2,6}$/,
  /**conmtraseña con Mayuscula miniscula numero y Caracter especial */
  hardPassword:
    /^(?=.*[a-zñáéíóúü])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ])+$/,
  softPassword: /^[0-9A-zÀ-Ÿ]+$/,
  /** */
  dd_mm_yyyy: /^([0-2][0-9]|3[0-1])(\/|\-|\\#|\_|\.)(0[1-9]|1[0-2])\2(\d{4})$/,
  /**formato de hora */
  HH_mm_ss: /^([0-1][0-9]|2[0-3])(:)([0-5][0-9])(:)([0-5][0-9])$/,
};
