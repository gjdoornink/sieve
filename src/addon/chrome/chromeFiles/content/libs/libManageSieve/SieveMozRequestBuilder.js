/*
 * The content of this file is licensed. You may obtain a copy of
 * the license at https://github.com/thsmi/sieve/ or request it via
 * email from the author.
 *
 * Do not remove or change this comment.
 *
 * The initial author of the code is:
 *   Thomas Schmid <schmid-thomas@gmx.net>
 */

(function (exports) {

  "use strict";

  /* global Components */
  const { SieveAbstractRequestBuilder } = require("./SieveAbstractRequestBuilder.js");

  /**
   * @inheritdoc
   */
  class SieveMozRequestBuilder extends SieveAbstractRequestBuilder {

    /**
     * Manage Sieve uses for literals UTF-8 as encoding, network sockets are usualy
     * binary, and javascript is something in between. This means we have to convert
     * UTF-8 into a binary by our own...
     *
     * @param {String} str The binary string which should be converted
     * @return {String} The converted string in UTF8
     *
     * @author Thomas Schmid <schmid-thomas@gmx.net>
     * @author Max Dittrich
     */
    jsStringToByteArray(str) {
      // This is very old mozilla specific code, but it is robust, mature and works as expeced.
      // It will be dropped as soon as the new code has proven to be stable.
      if ((typeof Components !== 'undefined')
        && (typeof Components.classes !== 'undefined')
        && (Components.classes["@mozilla.org/intl/scriptableunicodeconverter"])) {

        // ...and convert to UTF-8
        let converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
          .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);

        converter.charset = "UTF-8";

        return converter.convertToByteArray(str, {});
      }

      // with chrome we have to use the TextEncoder.
      let data = new Uint8Array(new TextEncoder("UTF-8").encode(str));
      return Array.prototype.slice.call(data);
    }

    /**
     * @inheritdoc
     */
    calculateByteLength(data) {
      return this.jsStringToByteArray(data).length;
    }

    /**
     * @inheritdoc
     */
    convertToBase64(decoded) {

      // btoa is a bit strange it requires a javascript (unicode) string
      // which contains only latin1 codepoint.

      if (Array.isArray(decoded))
        decoded = String.fromCharCode(...new Uint8Array(decoded));

      return btoa(decoded);
    }

    /**
     * @inheritDoc
     **/
    convertFromBase64(encoded) {
      return atob(encoded);
    }
  }

  exports.SieveMozRequestBuilder = SieveMozRequestBuilder;

})(module.exports);
