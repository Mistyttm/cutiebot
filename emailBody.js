exports.emailHead = `<html><head><link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
<style>
    .main_container {{
        padding: 0 10rem;
        font-family: 'Open Sans', sans-serif;
    }}
    .heading_text {{
        margin: 0.8rem 0;
        font-weight: 600;
        font-size: 3.5rem;
    }}
    .main_text {{
        margin: 1em 0;
        font-weight: 400;
        font-size: 1.5rem;
    }}
    .verification_code {{
        padding: 0 32px;
        font-family: JetBrains Mono, sans-serif;
        font-size: 112px;
        line-height: 1;
        color: #020202;
        font-weight: bold;
        letter-spacing: 5px;
        text-align: center;
    }}
    .footer_text {{
        margin: 3em 0;
        font-weight: 400;
        font-size: 1rem;
    }}
</style>
</head>`;

exports.emailBody1 = `<body>
<div class="main_container">
    <div class="heading_text">
        Your verification code for `;

exports.emailBody2 = `</div>
<div class="main_text">
    Hi <strong style="font-weight:600;">`;

exports.emailBody3 = `</strong>,<br>
Your verification code is:
</div>
<div class="verification_code">`;

exports.emailBody4 = `</div>
<div class="footer_text" style="text-align: center;">
    Thank you for using our bot.
</div>
<hr>
<div class="footer_text">
    You are receiving this message because this student number was
    used to verify a Discord account. If you did not request this 
    code please disregard this message.
</div>
</div>
</body>
</html>`;
