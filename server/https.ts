import { Request, Response, NextFunction } from 'express';

export default function httpsRedirect(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'production') {
        if (req.headers['x-forwarded-proto'] != 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
    }

    return next();
}
