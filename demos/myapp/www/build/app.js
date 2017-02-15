import { Button } from 'ionic-ui';

var config = {
    'mode': 'md'
};

var pages = [];

var components = [
    Button
];

class UserData {
}

var services = {
    'UserData': { useClass: UserData }
};

var routes = {};

bootstrapClient({
    config,
    pages,
    components,
    services,
    routes
});
