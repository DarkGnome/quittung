const $ = window.$

/** Init bindings onload. */
$(function () {
  // look for changes to text fields
  $(':text').bind('propertychange change click input paste', bindingWrapper)

  $(':radio').change(function () {
    const radio = $(this)
    handleFormLogic(radio)
  })

  // initially only show reason section for selected
  // $(':radio:checked').each(function() => handleFormLogic($(this)))
  $(':radio:checked').each(function () {
    const radio = $(this)
    handleFormLogic(radio)
  })
})

/** Wraps handleFormLogic by disabling the binding for the currently selected
    input, resulting in less useless callbacks. */
function bindingWrapper (event) {
  // unbind this text input, but bind all others
  $(':text').unbind()
  $(':text').bind('propertychange change click input paste', bindingWrapper)
  $(this).unbind()

  handleFormLogic($(this).parent().find(':radio'))
}

/** Shows/hides from and to sections depending on given @param radio. Also
    sets required and checked attributes. */
function handleFormLogic (radio) {
  const radioValue = radio.prop('value')
  var radioFrom, radioTo
  if (radioValue === 'to_us' || radioValue === 'from_them') {
    radioFrom = $(':radio[value=from_them]')
    radioTo = $(':radio[value=to_us]')
  } else if (radioValue === 'to_them' || radioValue === 'from_us') {
    radioFrom = $(':radio[value=from_us]')
    radioTo = $(':radio[value=to_them]')
  } else {
    radioFrom = radio
  }
  radioFrom.prop('checked', true)
  unrequireOthers(radioFrom)
  setRequired(radioFrom)

  if (radioTo) {
    radioTo.prop('checked', true)
    unrequireOthers(radioTo)
    // show only wanted section
    $('div[id^=to_]').hide()
    $('div[id=' + radioTo.prop('value') + '_section]').show()
    setRequired(radioTo)
  }
}

/** Unsets required for all other text fields related to @param radio. */
function unrequireOthers (radio) {
  $('body').find(':text:hidden').prop('required', false)
  radio.parent().parent().find(':text').prop('required', false)
}

/** Sets parent text field of @param radio to be required. */
function setRequired (radio) {
  radio.parent().find(':text').prop('required', true)
}
