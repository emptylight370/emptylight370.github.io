function encode()
{
    var input_text = document.getElementById('input');
    var output_text = document.getElementById('output');
    try
    {
        output_text.value = Base64.encode(input_text.value);
    }
    catch
    {
        output_text.value = "encode ERROR! It might not be a supported language."
    }
}

function decode()
{
    var input_text = document.getElementById('input');
    var output_text = document.getElementById('output');
    try
    {
        output_text.value = Base64.decode(input_text.value);
    }
    catch
    {
        output_text.value = "decode ERROR! Please check your input. It might not be a valid Base64 string."
    }
}

function copy()
{
    var output_text = document.getElementById('output');
    navigator.clipboard.writeText(output_text.value).then(function () { notification("Copied!", "success", 1200); }, function () { notification("Failed!", "fail", 1200); });
}

function notification(message, state, duration)
{
    var notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.right = 'calc(49%)';
    notification.style.padding = '10px';
    if (state == "success")
        notification.style.backgroundColor = 'white';
    else if (state == "fail")
        notification.style.backgroundColor = 'yellow';
    notification.style.border = '1px solid black';
    notification.style.borderRadius = '5px';
    document.body.appendChild(notification);

    setTimeout(function ()
    {
        document.body.removeChild(notification);
    }, duration);
}