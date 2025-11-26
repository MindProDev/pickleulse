const { withDangerousMod, withXcodeProject } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withWatch = (config) => {
    return withDangerousMod(config, [
        'ios',
        async (config) => {
            const projectRoot = config.modRequest.projectRoot;
            const watchDir = path.join(projectRoot, 'targets', 'watch');

            // Ensure the targets/watch directory exists
            if (!fs.existsSync(watchDir)) {
                fs.mkdirSync(watchDir, { recursive: true });

                // Create basic Watch files if they don't exist
                // This is a placeholder - in a real scenario, we'd copy template files
                console.log('Created watch target directory:', watchDir);
            }

            return config;
        },
    ]);
};

module.exports = withWatch;
