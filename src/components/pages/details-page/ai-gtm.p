Look at the folder 'src/app/components/all-pages' and Update all file with the following instructions.

Page-101
    - 'src/components/pages/details-page/data.ts'
    - 'src/components/pages/details-page/Mutation.tsx'
    - 'src/components/pages/details-page/Query.tsx'

now generate a file name gtm-event-fire.ts and it will file the event if Query.tsx is render. and implement full functionality. 

here is an example of event fire 
```
'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';

const GtmRouteChangeInner = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasSkippedInitialPageView = useRef(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GTM_ID) return;

    if (!hasSkippedInitialPageView.current) {
      hasSkippedInitialPageView.current = true;
      return;
    }

    const query = searchParams.toString();

    sendGTMEvent({
      event: 'page_view',
      page_path: pathname,
      page_query: query,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
};

const GtmRouteChange = () => (
  <Suspense fallback={null}>
    <GtmRouteChangeInner />
  </Suspense>
);

export default GtmRouteChange;
```

And make sure it will fire once and it will fire dynamic data not default data in data.ts

If I click buy now button then it will be fire add_to_cart event
