require('react');
const { Html } = require('@react-email/html');
const { Button } = require('@react-email/button');

const Email = () => {
    return (
        <Html>
            <Button
        pX={20}
        pY={12}
        href="https://example.com"
        style={{ background: '#000', color: '#fff' }}
      >
        Click me
      </Button>
        </Html>
    );
};

exports.Email = Email;
