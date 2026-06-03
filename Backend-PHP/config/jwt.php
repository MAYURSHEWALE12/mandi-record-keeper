<?php

return [
    'secret' => $_ENV['JWT_SECRET'] ?? 'your_super_secret_jwt_key_here_change_in_production',
    'algo' => 'HS256',
    'expiry' => 86400 * 7,
];
