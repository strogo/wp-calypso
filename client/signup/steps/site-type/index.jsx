/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import i18n, { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import StepWrapper from 'signup/step-wrapper';
import SignupActions from 'lib/signup/actions';
import formState from 'lib/form-state';
import { setSiteType } from 'state/signup/steps/site-type/actions';
import { getSiteType } from 'state/signup/steps/site-type/selectors';

//Form components
import Card from 'components/card';
import Button from 'components/button';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormRadio from 'components/forms/form-radio';

class SiteType extends Component {
	constructor( props ) {
		super( props );
		this._isMounted = false;
		this.state = {
			siteType: props.siteType,
		};
	}

	componentDidMount() {
		this._isMounted = true;
		this.formStateController = new formState.Controller( {
			fieldNames: [ 'siteType' ],
			validatorFunction: noop,
			onNewState: this.setFormState,
			hideFieldErrorsOnChange: true,
			initialState: {
				siteType: {
					value: this.props.siteType,
				},
			},
		} );
		this.setFormState( this.formStateController.getInitialState() );
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	setFormState = state => {
		this._isMounted && this.setState( { form: state } );
	};

	handleRadioChange = event => {
		this.formStateController.handleFieldChange( {
			name: event.target.name,
			value: event.target.value,
		} );
		this.setState( { siteType: event.target.value } );
	};

	handleSubmit = event => {
		event.preventDefault();
		const siteTypeInput = formState.getFieldValue( this.state.form, 'siteType' );
		// Default siteType is 'blogger'
		this.props.submitStep( siteTypeInput || 'blogger' );
	};

	renderContent() {
		const { translate, siteType } = this.props;

		return (
			<div className="site-type__wrapper">
				<div className="site-type__form-wrapper">
					<form onSubmit={ this.handleSubmit }>
						<Card>
							<h3>{ translate( 'Pick the option that best describes you' ) }</h3>
							<FormFieldset>
								<FormLabel className="site-type__option">
									<FormRadio
										name="siteType"
										value="blogger"
										checked={ 'blogger' === siteType }
										onChange={ this.handleRadioChange }
									/>
									<span>
										<strong>Blogger</strong>
										<span>Share your story with a collection of posts.</span>
									</span>
								</FormLabel>

								<FormLabel className="site-type__option">
									<FormRadio
										name="siteType"
										value="business"
										checked={ 'business' === siteType }
										onChange={ this.handleRadioChange }
									/>
									<span>
										<strong>Business</strong>
										<span>Promote your products or services.</span>
									</span>
								</FormLabel>

								<FormLabel className="site-type__option">
									<FormRadio
										name="siteType"
										value="professional"
										checked={ 'professional' === siteType }
										onChange={ this.handleRadioChange }
									/>
									<span>
										<strong>Professional</strong>
										<span>Showcase your portfolio, skills, or work.</span>
									</span>
								</FormLabel>

								<FormLabel className="site-type__option">
									<FormRadio
										name="siteType"
										value="educator"
										checked={ 'educator' === siteType }
										onChange={ this.handleRadioChange }
									/>
									<span>
										<strong>Educator</strong>
										<span>Share school projects or classroom information.</span>
									</span>
								</FormLabel>

								<FormLabel className="site-type__option">
									<FormRadio
										name="siteType"
										value="non-profit"
										checked={ 'non-profit' === siteType }
										onChange={ this.handleRadioChange }
									/>
									<span>
										<strong>Non-profit Organization</strong>
										<span>Raise money or awareness for a case.</span>
									</span>
								</FormLabel>
							</FormFieldset>

							<div className="site-type__submit-wrapper">
								<Button primary={ true } type="submit">
									{ translate( 'Continue' ) }
								</Button>
							</div>
						</Card>
					</form>
				</div>
			</div>
		);
	}

	render() {
		const { flowName, positionInFlow, signupProgress, stepName, translate } = this.props;

		const headerText = translate( 'What type of website do you need?' );
		const subHeaderText = translate(
			'WordPress can do it all, but you probably have something more specific in mind.'
		);

		return (
			<StepWrapper
				flowName={ flowName }
				stepName={ stepName }
				positionInFlow={ positionInFlow }
				headerText={ headerText }
				fallbackHeaderText={ headerText }
				subHeaderText={ subHeaderText }
				fallbackSubHeaderText={ subHeaderText }
				signupProgress={ signupProgress }
				stepContent={ this.renderContent() }
			/>
		);
	}
}

export default connect(
	state => ( {
		siteType: getSiteType( state ),
	} ),
	( dispatch, ownProps ) => ( {
		submitStep: siteTypeValue => {
			dispatch( setSiteType( siteTypeValue ) );
			// Create site
			SignupActions.submitSignupStep(
				{
					processingMessage: i18n.translate( 'Collecting your information' ),
					stepName: ownProps.stepName,
				},
				[],
				{
					siteType: siteTypeValue,
				}
			);
			ownProps.goToNextStep( ownProps.flowName );
		},
	} )
)( localize( SiteType ) );
