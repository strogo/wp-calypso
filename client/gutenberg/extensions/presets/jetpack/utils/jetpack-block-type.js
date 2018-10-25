/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { every, has, get, pickBy } from 'lodash';

/**
 * Where Jetpack data can be found in WP Admin
 */
const JETPACK_DATA_PATH = [ 'Jetpack_Initial_State' ];

export default class JetpackBlockType {
	constructor( name, config ) {
		this.name = name;
		this.config = config;
		this.requiredModules = null;
		this.jetpackData = get(
			'object' === typeof window ? window : null,
			JETPACK_DATA_PATH,
			null
		);
		return this;
	}

	requireModules( modules ) {
		this.requiredModules = modules;
		return this;
	}

	hasRequiredModules = () => {
		const activeModules = pickBy( get( this.jetpackData, 'getModules' ), ( module ) => { return module.activated && module.override !== 'inactive' } );
		return every( this.requiredModules.map( ( name ) => has( activeModules, name ) ), Boolean );
	};

	register() {
		if ( this.requiredModules && ! this.hasRequiredModules() ) {
			return this;
		}

		registerBlockType( this.name, this.config );
	}
}
