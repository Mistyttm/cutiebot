const emailBody = (guildName, userName, code) => {
    return `<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
            rel="stylesheet"
        />
    </head>
    <body>
        <style>
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td {
                line-height: 100%;
            }
            .ExternalClass {
                width: 100%;
            }

            @media screen and (-webkit-min-device-pixel-ratio:0) {
                .main-container {
                    margin: auto;
                    padding: 20px 32px;
                    text-align: left;
                    min-width: min-content;
                    font-size: 14px;
                    font-family: "Open Sans", sans-serif;
                    color: #212121;
                    background-color: #FFFFFF;
                }

                .heading-text {
                    font-weight: bold;
                    font-size: 40px;
                    padding: 32px 3.2px;
                }

                .main-text {
                    padding: 3.2px 3.2px 8px;
                    line-height: 1.75;
                }

                .verification-code {
                    padding: 32px 0px 40px 0px;
                    font-family: JetBrains Mono, sans-serif;
                    font-size: 80px;
                    color: #232323;
                    font-weight: bold;
                    letter-spacing: 5px;
                    text-align: center;
                }

                .footnote {
                    padding: 6.4px 3.2px;
                    font-size: 12px;
                }

                #username {
                    font-weight: bold;
                }

                @media (width >= 640px) {
                    .main-container {
                        max-width: 720px;
                        padding-top: 24px;
                    }

                    .heading-text {
                        font-size: 48px;
                        padding-bottom: 36px;
                    }
                }
            }
        </style>
        <div class="main-container">
            <div class="heading-text">
                Your verification code for ${guildName}
            </div>
            <div class="main-text">
                <div class="greeting-text">
                    Hi <span id="username">${userName}</span>,
                    <br />
                    Your verification code is:
                </div>
                <div class="verification-code">${code}</div>
                <div class="footer-text">Thank you for using our bot.</div>
            </div>
            <hr />
            <div class="footnote">
                You are receiving this message because this student number was
                used to verify a Discord account. If you did not request this
                then please disregard this message.
            </div>
        </div>
    </body>
</html>`;
};

export { emailBody };
