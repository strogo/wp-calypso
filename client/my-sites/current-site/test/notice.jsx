/** @format */

/**
 * External dependencies
 */
import React from 'react';
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
jest.mock( 'lib/abtest', () => ( {
	abtest: () => '',
} ) );

jest.mock( 'i18n-calypso', () => ( {
	localize: Component => props => <Component { ...props } translate={ x => x } />,
	translate: x => x,
} ) );

import SiteNotice from '../notice';

describe( 'Has pending cart notice', () => {
	const site = { ID: 12345, slug: 'site_slug' };

	test( 'should render null when no pending cart exists', () => {
		const wrapper = shallow( <SiteNotice site={ site } hasPendingPayment={ true } /> ); // tofix
		expect( wrapper.pendingPaymentNotice() ).toEqual( null );
	} );

	test( 'should render component when site information is available and the site is eligible', () => {
		const wrapper = shallow( <SiteNotice site={ site } hasPendingPayment={ false } /> );
		expect( wrapper.pendingPaymentNotice().displayName ).toEqual( 'Connect(Localized(Notice))' ); //tofix
	} );
} );
